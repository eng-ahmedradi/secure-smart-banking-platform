package com.securebank.api.dto;

import java.math.BigDecimal;
import java.time.Instant;

public class TransferReceiptResponse {
    private String reference;
    private BigDecimal amount;
    private String recipient;
    private String channel;
    private BigDecimal remainingBalance;
    private Instant date;

    public TransferReceiptResponse(String reference, BigDecimal amount, String recipient,
                                    String channel, BigDecimal remainingBalance, Instant date) {
        this.reference = reference;
        this.amount = amount;
        this.recipient = recipient;
        this.channel = channel;
        this.remainingBalance = remainingBalance;
        this.date = date;
    }

    public String getReference() { return reference; }
    public BigDecimal getAmount() { return amount; }
    public String getRecipient() { return recipient; }
    public String getChannel() { return channel; }
    public BigDecimal getRemainingBalance() { return remainingBalance; }
    public Instant getDate() { return date; }
}
