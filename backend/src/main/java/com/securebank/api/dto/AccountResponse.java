package com.securebank.api.dto;

import com.securebank.api.model.Account;
import java.math.BigDecimal;

public class AccountResponse {
    private Long id;
    private String accountNumber;
    private String iban;
    private String accountType;
    private BigDecimal balance;
    private String currency;
    private String status;

    public static AccountResponse from(Account a) {
        AccountResponse r = new AccountResponse();
        r.id = a.getId();
        r.accountNumber = a.getAccountNumber();
        r.iban = a.getIban();
        r.accountType = a.getAccountType();
        r.balance = a.getBalance();
        r.currency = a.getCurrency();
        r.status = a.getStatus();
        return r;
    }

    public Long getId() { return id; }
    public String getAccountNumber() { return accountNumber; }
    public String getIban() { return iban; }
    public String getAccountType() { return accountType; }
    public BigDecimal getBalance() { return balance; }
    public String getCurrency() { return currency; }
    public String getStatus() { return status; }
}
