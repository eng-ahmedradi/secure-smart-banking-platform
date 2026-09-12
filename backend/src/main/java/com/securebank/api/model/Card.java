package com.securebank.api.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.YearMonth;

@Entity
@Table(name = "cards")
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_id")
    private Account account;

    @Column(nullable = false, unique = true)
    private String cardNumber; // stored in full server-side; only masked form is ever returned by the API

    @Column(nullable = false)
    private String cvv; // demo only - never do this with real card data

    @Column(nullable = false)
    private String cardholderName;

    @Column(nullable = false)
    private String expiryMonthYear; // MM/YY

    @Column(nullable = false)
    private String cardType = "VISA_PLATINUM";

    @Column(nullable = false)
    private boolean frozen = false;

    @Column(nullable = false)
    private double dailyLimit = 10000.0;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Account getAccount() { return account; }
    public void setAccount(Account account) { this.account = account; }

    public String getCardNumber() { return cardNumber; }
    public void setCardNumber(String cardNumber) { this.cardNumber = cardNumber; }

    public String getCvv() { return cvv; }
    public void setCvv(String cvv) { this.cvv = cvv; }

    public String getCardholderName() { return cardholderName; }
    public void setCardholderName(String cardholderName) { this.cardholderName = cardholderName; }

    public String getExpiryMonthYear() { return expiryMonthYear; }
    public void setExpiryMonthYear(String expiryMonthYear) { this.expiryMonthYear = expiryMonthYear; }

    public String getCardType() { return cardType; }
    public void setCardType(String cardType) { this.cardType = cardType; }

    public boolean isFrozen() { return frozen; }
    public void setFrozen(boolean frozen) { this.frozen = frozen; }

    public double getDailyLimit() { return dailyLimit; }
    public void setDailyLimit(double dailyLimit) { this.dailyLimit = dailyLimit; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public static String defaultExpiry() {
        YearMonth ym = YearMonth.now().plusYears(4);
        return String.format("%02d/%02d", ym.getMonthValue(), ym.getYear() % 100);
    }
}
