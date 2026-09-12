package com.securebank.api.dto;

import com.securebank.api.model.Transaction;
import java.math.BigDecimal;
import java.time.Instant;

public class TransactionResponse {
    private Long id;
    private Long accountId;
    private String reference;
    private String direction;
    private String category;
    private String title;
    private String counterparty;
    private BigDecimal amount;
    private BigDecimal fee;
    private BigDecimal balanceAfter;
    private String channel;
    private Instant createdAt;

    public static TransactionResponse from(Transaction t) {
        TransactionResponse r = new TransactionResponse();
        r.id = t.getId();
        r.accountId = t.getAccount().getId();
        r.reference = t.getReference();
        r.direction = t.getDirection();
        r.category = t.getCategory();
        r.title = t.getTitle();
        r.counterparty = t.getCounterparty();
        r.amount = t.getAmount();
        r.fee = t.getFee();
        r.balanceAfter = t.getBalanceAfter();
        r.channel = t.getChannel();
        r.createdAt = t.getCreatedAt();
        return r;
    }

    public Long getId() { return id; }
    public Long getAccountId() { return accountId; }
    public String getReference() { return reference; }
    public String getDirection() { return direction; }
    public String getCategory() { return category; }
    public String getTitle() { return title; }
    public String getCounterparty() { return counterparty; }
    public BigDecimal getAmount() { return amount; }
    public BigDecimal getFee() { return fee; }
    public BigDecimal getBalanceAfter() { return balanceAfter; }
    public String getChannel() { return channel; }
    public Instant getCreatedAt() { return createdAt; }
}
