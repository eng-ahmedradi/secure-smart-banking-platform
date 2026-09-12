package com.securebank.api.dto;

import jakarta.validation.constraints.Positive;

public class UpdateLimitRequest {
    @Positive(message = "الحد اليومي يجب أن يكون أكبر من صفر")
    private double dailyLimit;

    public double getDailyLimit() { return dailyLimit; }
    public void setDailyLimit(double dailyLimit) { this.dailyLimit = dailyLimit; }
}
