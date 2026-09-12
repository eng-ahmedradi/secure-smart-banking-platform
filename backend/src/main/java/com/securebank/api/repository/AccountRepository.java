package com.securebank.api.repository;

import com.securebank.api.model.Account;
import com.securebank.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findByUser(User user);
    Optional<Account> findByAccountNumber(String accountNumber);
    Optional<Account> findByIban(String iban);
    boolean existsByAccountNumber(String accountNumber);
    boolean existsByIban(String iban);
}
