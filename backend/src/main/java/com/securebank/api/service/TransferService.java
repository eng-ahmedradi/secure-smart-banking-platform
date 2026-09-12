package com.securebank.api.service;

import com.securebank.api.dto.*;
import com.securebank.api.model.Account;
import com.securebank.api.model.PendingTransfer;
import com.securebank.api.model.Transaction;
import com.securebank.api.repository.AccountRepository;
import com.securebank.api.repository.PendingTransferRepository;
import com.securebank.api.repository.TransactionRepository;
import com.securebank.api.util.GeneratorUtil;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
public class TransferService {

    private static final BigDecimal EXTERNAL_FEE = new BigDecimal("5.00");

    private final PendingTransferRepository pendingTransferRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final AccountService accountService;

    public TransferService(PendingTransferRepository pendingTransferRepository,
                            AccountRepository accountRepository,
                            TransactionRepository transactionRepository,
                            AccountService accountService) {
        this.pendingTransferRepository = pendingTransferRepository;
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
        this.accountService = accountService;
    }

    /**
     * Step 1: validate the transfer and issue an OTP, mirroring the OTP modal in transfer.html.
     * A real deployment would send this via SMS; here it's returned in the response so the
     * frontend (or Postman) can complete the flow without a real SMS provider.
     */
    @Transactional
    public TransferInitResponse initiateTransfer(TransferRequest req) {
        Account source = accountService.getOwnedAccountOrThrow(req.getSourceAccountId());

        if (!"ACTIVE".equals(source.getStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "الحساب المصدر غير نشط حالياً");
        }

        BigDecimal fee = "internal".equalsIgnoreCase(req.getChannel()) ? BigDecimal.ZERO : EXTERNAL_FEE;
        BigDecimal total = req.getAmount().add(fee);

        if (source.getBalance().compareTo(total) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "الرصيد غير كافٍ لإتمام هذه العملية");
        }

        if ("internal".equalsIgnoreCase(req.getChannel())) {
            Optional<Account> destination = accountRepository.findByAccountNumber(req.getRecipient());
            if (destination.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "رقم الحساب المستلم غير موجود داخل البنك");
            }
            if (destination.get().getId().equals(source.getId())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "لا يمكن التحويل لنفس الحساب");
            }
        }

        PendingTransfer pending = new PendingTransfer();
        pending.setSourceAccount(source);
        pending.setChannel(req.getChannel().toLowerCase());
        pending.setRecipient(req.getRecipient());
        pending.setAmount(req.getAmount());
        pending.setOtpCode(GeneratorUtil.otp());
        pending.setExpiresAt(Instant.now().plus(5, ChronoUnit.MINUTES));
        pending = pendingTransferRepository.save(pending);

        return new TransferInitResponse(
                pending.getId(),
                "تم إرسال رمز التحقق (OTP). صالح لمدة 5 دقائق.",
                pending.getOtpCode()
        );
    }

    /**
     * Step 2: confirm with the OTP and execute the transfer atomically.
     */
    @Transactional
    public TransferReceiptResponse confirmTransfer(Long pendingTransferId, OtpConfirmRequest req) {
        PendingTransfer pending = pendingTransferRepository.findById(pendingTransferId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "طلب التحويل غير موجود"));

        // Make sure this pending transfer belongs to one of the current user's accounts.
        accountService.getOwnedAccountOrThrow(pending.getSourceAccount().getId());

        if (pending.isConfirmed()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "تم تنفيذ هذا التحويل بالفعل");
        }
        if (pending.isExpired()) {
            throw new ResponseStatusException(HttpStatus.GONE, "انتهت صلاحية رمز التحقق، يرجى بدء التحويل من جديد");
        }
        if (pending.getAttempts() >= 3) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "تم تجاوز عدد محاولات إدخال الرمز المسموح بها");
        }
        if (!pending.getOtpCode().equals(req.getOtp())) {
            pending.setAttempts(pending.getAttempts() + 1);
            pendingTransferRepository.save(pending);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "رمز التحقق غير صحيح");
        }

        Account source = pending.getSourceAccount();
        BigDecimal fee = "internal".equalsIgnoreCase(pending.getChannel()) ? BigDecimal.ZERO : EXTERNAL_FEE;
        BigDecimal total = pending.getAmount().add(fee);

        if (source.getBalance().compareTo(total) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "الرصيد غير كافٍ لإتمام هذه العملية");
        }

        String reference = GeneratorUtil.transactionReference();

        // Debit source account
        source.setBalance(source.getBalance().subtract(total));
        accountRepository.save(source);

        Transaction outTx = new Transaction();
        outTx.setAccount(source);
        outTx.setReference(reference);
        outTx.setDirection("OUT");
        outTx.setCategory(pending.getChannel().equals("internal") ? "transfer" : pending.getChannel());
        outTx.setTitle(channelTitle(pending.getChannel()));
        outTx.setCounterparty("إلى: " + pending.getRecipient());
        outTx.setAmount(pending.getAmount());
        outTx.setFee(fee);
        outTx.setBalanceAfter(source.getBalance());
        outTx.setChannel(pending.getChannel());
        transactionRepository.save(outTx);

        // Credit destination account only for internal transfers within the bank.
        if ("internal".equalsIgnoreCase(pending.getChannel())) {
            Account destination = accountRepository.findByAccountNumber(pending.getRecipient())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "رقم الحساب المستلم غير موجود"));

            destination.setBalance(destination.getBalance().add(pending.getAmount()));
            accountRepository.save(destination);

            Transaction inTx = new Transaction();
            inTx.setAccount(destination);
            inTx.setReference(reference);
            inTx.setDirection("IN");
            inTx.setCategory("transfer");
            inTx.setTitle("تحويل داخلي وارد");
            inTx.setCounterparty("من: " + source.getAccountNumber());
            inTx.setAmount(pending.getAmount());
            inTx.setFee(BigDecimal.ZERO);
            inTx.setBalanceAfter(destination.getBalance());
            inTx.setChannel(pending.getChannel());
            transactionRepository.save(inTx);
        }

        pending.setConfirmed(true);
        pendingTransferRepository.save(pending);

        return new TransferReceiptResponse(
                reference,
                pending.getAmount(),
                pending.getRecipient(),
                pending.getChannel(),
                source.getBalance(),
                Instant.now()
        );
    }

    private String channelTitle(String channel) {
        return switch (channel.toLowerCase()) {
            case "internal" -> "تحويل داخلي فوري";
            case "ipn" -> "تحويل عبر شبكة المدفوعات IPN";
            case "iban" -> "تحويل بنكي محلي (IBAN)";
            default -> "تحويل مالي";
        };
    }
}
