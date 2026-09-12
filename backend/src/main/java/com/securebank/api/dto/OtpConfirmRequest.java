package com.securebank.api.dto;

import jakarta.validation.constraints.NotBlank;

public class OtpConfirmRequest {
    @NotBlank
    private String otp;

    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }
}
