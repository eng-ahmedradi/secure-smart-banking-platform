package com.securebank.api.repository;

import com.securebank.api.model.Account;
import com.securebank.api.model.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CardRepository extends JpaRepository<Card, Long> {
    List<Card> findByAccount(Account account);
    List<Card> findByAccountIn(List<Account> accounts);
}
