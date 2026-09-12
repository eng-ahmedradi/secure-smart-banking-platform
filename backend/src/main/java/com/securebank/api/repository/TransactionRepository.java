package com.securebank.api.repository;

import com.securebank.api.model.Account;
import com.securebank.api.model.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Page<Transaction> findByAccountInOrderByCreatedAtDesc(List<Account> accounts, Pageable pageable);
    List<Transaction> findByAccountInOrderByCreatedAtDesc(List<Account> accounts);
}
