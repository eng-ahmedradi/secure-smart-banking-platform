package com.securebank.api.controller;

import com.securebank.api.dto.CardResponse;
import com.securebank.api.dto.CardRevealResponse;
import com.securebank.api.dto.UpdateLimitRequest;
import com.securebank.api.service.CardService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cards")
public class CardController {

    private final CardService cardService;

    public CardController(CardService cardService) {
        this.cardService = cardService;
    }

    @GetMapping
    public ResponseEntity<List<CardResponse>> getMyCards() {
        return ResponseEntity.ok(cardService.getMyCards());
    }

    /** Returns the full card number & CVV - mirrors the "reveal" eye icon on cards.html. */
    @PostMapping("/{id}/reveal")
    public ResponseEntity<CardRevealResponse> reveal(@PathVariable Long id) {
        return ResponseEntity.ok(cardService.revealCard(id));
    }

    @PatchMapping("/{id}/freeze")
    public ResponseEntity<CardResponse> setFrozen(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        boolean frozen = Boolean.TRUE.equals(body.getOrDefault("frozen", true));
        return ResponseEntity.ok(cardService.setFrozen(id, frozen));
    }

    @PutMapping("/{id}/limit")
    public ResponseEntity<CardResponse> updateLimit(@PathVariable Long id, @Valid @RequestBody UpdateLimitRequest request) {
        return ResponseEntity.ok(cardService.updateDailyLimit(id, request.getDailyLimit()));
    }
}
