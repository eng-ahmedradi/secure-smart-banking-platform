package com.securebank.api.controller;

import com.securebank.api.dto.*;
import com.securebank.api.service.TransferService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transfers")
public class TransferController {

    private final TransferService transferService;

    public TransferController(TransferService transferService) {
        this.transferService = transferService;
    }

    /** Step 1 - validates the transfer and issues an OTP (see transfer.html's OTP modal). */
    @PostMapping
    public ResponseEntity<TransferInitResponse> initiate(@Valid @RequestBody TransferRequest request) {
        return ResponseEntity.ok(transferService.initiateTransfer(request));
    }

    /** Step 2 - confirms the OTP and executes the transfer. */
    @PostMapping("/{pendingTransferId}/confirm")
    public ResponseEntity<TransferReceiptResponse> confirm(@PathVariable Long pendingTransferId,
                                                             @Valid @RequestBody OtpConfirmRequest request) {
        return ResponseEntity.ok(transferService.confirmTransfer(pendingTransferId, request));
    }
}
