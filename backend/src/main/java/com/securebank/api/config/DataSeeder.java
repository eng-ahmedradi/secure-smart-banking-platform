package com.securebank.api.config;

import com.securebank.api.model.*;
import com.securebank.api.repository.*;
import com.securebank.api.util.GeneratorUtil;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

/**
 * Seeds a demo user on startup so the app is usable immediately, matching the
 * hardcoded demo credentials in the original frontend's login.js (admin / 123456).
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final CardRepository cardRepository;
    private final TransactionRepository transactionRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, AccountRepository accountRepository,
                       CardRepository cardRepository, TransactionRepository transactionRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.cardRepository = cardRepository;
        this.transactionRepository = transactionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.existsByUsername("admin")) {
            return;
        }

        User admin = new User();
        admin.setFullName("أحمد مصطفى");
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("123456"));
        admin.setEmail("admin@securebank.demo");
        admin.setPhone("01000000000");
        admin = userRepository.save(admin);

        Account account = new Account();
        account.setUser(admin);
        account.setAccountNumber(GeneratorUtil.accountNumber());
        account.setIban(GeneratorUtil.iban(account.getAccountNumber()));
        account.setAccountType("CHECKING");
        account.setBalance(new BigDecimal("42500.00"));
        account = accountRepository.save(account);

        Card card = new Card();
        card.setAccount(account);
        card.setCardNumber("4490812099344490");
        card.setCvv("842");
        card.setCardholderName(admin.getFullName());
        card.setExpiryMonthYear(Card.defaultExpiry());
        card.setCardType("VISA_PLATINUM");
        card.setDailyLimit(10000);
        cardRepository.save(card);

        seedTransaction(account, "IN", "salary", "تحويل وارد - راتب شهري", "من: شركة الدلتا للتكنولوجيا",
                "25000.00", "0.00", "internal", 8);
        seedTransaction(account, "OUT", "bills", "سداد فاتورة مرافق وخدمات", "الشركة القابضة للمياه والكهرباء",
                "1450.00", "0.00", "bills", 6);
        seedTransaction(account, "OUT", "card", "شراء إلكتروني عبر الإنترنت", "Amazon Web Services",
                "820.00", "0.00", "card", 5);
        seedTransaction(account, "IN", "ipn", "تحويل لحظي وارد (IPN)", "من: أحمد مصطفى",
                "17500.00", "0.00", "ipn", 3);
        seedTransaction(account, "OUT", "card", "سوبر ماركت ومشتريات", "هايبر وان - الشيخ زايد",
                "9000.00", "0.00", "card", 1);
    }

    private void seedTransaction(Account account, String direction, String category, String title,
                                  String counterparty, String amount, String fee, String channel,
                                  int daysAgo) {
        Transaction tx = new Transaction();
        tx.setAccount(account);
        tx.setReference(GeneratorUtil.transactionReference());
        tx.setDirection(direction);
        tx.setCategory(category);
        tx.setTitle(title);
        tx.setCounterparty(counterparty);
        tx.setAmount(new BigDecimal(amount));
        tx.setFee(new BigDecimal(fee));
        tx.setBalanceAfter(account.getBalance());
        tx.setChannel(channel);
        tx.setCreatedAt(Instant.now().minus(daysAgo, ChronoUnit.DAYS));
        transactionRepository.save(tx);
    }
}
