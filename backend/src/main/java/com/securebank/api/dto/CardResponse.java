package com.securebank.api.dto;

import com.securebank.api.model.Card;

public class CardResponse {
    private Long id;
    private Long accountId;
    private String maskedCardNumber;
    private String cardholderName;
    private String expiryMonthYear;
    private String cardType;
    private boolean frozen;
    private double dailyLimit;

    public static CardResponse from(Card c) {
        CardResponse r = new CardResponse();
        r.id = c.getId();
        r.accountId = c.getAccount().getId();
        String digits = c.getCardNumber().replaceAll("\\s", "");
        r.maskedCardNumber = "•••• •••• •••• " + digits.substring(digits.length() - 4);
        r.cardholderName = c.getCardholderName();
        r.expiryMonthYear = c.getExpiryMonthYear();
        r.cardType = c.getCardType();
        r.frozen = c.isFrozen();
        r.dailyLimit = c.getDailyLimit();
        return r;
    }

    public Long getId() { return id; }
    public Long getAccountId() { return accountId; }
    public String getMaskedCardNumber() { return maskedCardNumber; }
    public String getCardholderName() { return cardholderName; }
    public String getExpiryMonthYear() { return expiryMonthYear; }
    public String getCardType() { return cardType; }
    public boolean isFrozen() { return frozen; }
    public double getDailyLimit() { return dailyLimit; }
}
