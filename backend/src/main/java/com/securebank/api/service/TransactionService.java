package com.securebank.api.service;

import com.securebank.api.dto.TransactionResponse;
import com.securebank.api.model.Account;
import com.securebank.api.model.Transaction;
import com.securebank.api.repository.TransactionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountService accountService;

    public TransactionService(TransactionRepository transactionRepository, AccountService accountService) {
        this.transactionRepository = transactionRepository;
        this.accountService = accountService;
    }

    /**
     * List transactions across all of the current user's accounts, optionally filtered
     * by direction (in/out), category, and free-text search - mirroring transactions.html's
     * pill filters and search box.
     */
    public Page<TransactionResponse> listMyTransactions(String direction, String category, String search,
                                                         int page, int size) {
        List<Account> accounts = accountService.getMyAccountEntities();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<Transaction> all = transactionRepository.findByAccountInOrderByCreatedAtDesc(accounts, pageable);

        List<TransactionResponse> filtered = all.getContent().stream()
                .filter(t -> direction == null || direction.equalsIgnoreCase("all")
                        || t.getDirection().equalsIgnoreCase(direction))
                .filter(t -> category == null || category.equalsIgnoreCase("all")
                        || t.getCategory().equalsIgnoreCase(category))
                .filter(t -> search == null || search.isBlank()
                        || t.getTitle().toLowerCase().contains(search.toLowerCase())
                        || t.getReference().toLowerCase().contains(search.toLowerCase())
                        || (t.getCounterparty() != null && t.getCounterparty().toLowerCase().contains(search.toLowerCase())))
                .map(TransactionResponse::from)
                .collect(Collectors.toList());

        return new org.springframework.data.domain.PageImpl<>(filtered, pageable, all.getTotalElements());
    }

    public TransactionResponse getReceipt(Long transactionId) {
        List<Account> myAccounts = accountService.getMyAccountEntities();
        Transaction tx = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "العملية غير موجودة"));

        boolean owns = myAccounts.stream().anyMatch(a -> a.getId().equals(tx.getAccount().getId()));
        if (!owns) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "لا تملك صلاحية الوصول لهذه العملية");
        }
        return TransactionResponse.from(tx);
    }
}
