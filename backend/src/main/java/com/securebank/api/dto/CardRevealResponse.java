package com.securebank.api.dto;

public class CardRevealResponse {
    private String cardNumber;
    private String cvv;

    public CardRevealResponse(String cardNumber, String cvv) {
        this.cardNumber = cardNumber;
        this.cvv = cvv;
    }

    public String getCardNumber() { return cardNumber; }
    public String getCvv() { return cvv; }
}
