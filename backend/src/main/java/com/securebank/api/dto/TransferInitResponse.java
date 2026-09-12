package com.securebank.api.dto;

public class TransferInitResponse {
    private Long pendingTransferId;
    private String message;
    // In a real bank the OTP is sent by SMS/email and never returned by the API.
    // For this local demo (no SMS provider wired up) it's echoed back so you can test end-to-end.
    private String demoOtp;

    public TransferInitResponse(Long pendingTransferId, String message, String demoOtp) {
        this.pendingTransferId = pendingTransferId;
        this.message = message;
        this.demoOtp = demoOtp;
    }

    public Long getPendingTransferId() { return pendingTransferId; }
    public String getMessage() { return message; }
    public String getDemoOtp() { return demoOtp; }
}
