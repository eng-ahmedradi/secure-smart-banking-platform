package com.securebank.api.controller;

import com.securebank.api.dto.TransactionResponse;
import com.securebank.api.service.TransactionService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    /**
     * Mirrors the filters on transactions.html: pill filters (all/in/out/card/bills)
     * and the live search box, plus simple pagination.
     */
    @GetMapping
    public ResponseEntity<Page<TransactionResponse>> list(
            @RequestParam(required = false, defaultValue = "all") String direction,
            @RequestParam(required = false, defaultValue = "all") String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(transactionService.listMyTransactions(direction, category, search, page, size));
    }

    @GetMapping("/{id}/receipt")
    public ResponseEntity<TransactionResponse> receipt(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.getReceipt(id));
    }
}
