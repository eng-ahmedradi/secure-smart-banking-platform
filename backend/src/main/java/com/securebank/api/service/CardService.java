package com.securebank.api.service;

import com.securebank.api.dto.CardResponse;
import com.securebank.api.dto.CardRevealResponse;
import com.securebank.api.model.Account;
import com.securebank.api.model.Card;
import com.securebank.api.repository.CardRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CardService {

    private final CardRepository cardRepository;
    private final AccountService accountService;

    public CardService(CardRepository cardRepository, AccountService accountService) {
        this.cardRepository = cardRepository;
        this.accountService = accountService;
    }

    public List<CardResponse> getMyCards() {
        List<Account> accounts = accountService.getMyAccountEntities();
        return cardRepository.findByAccountIn(accounts).stream()
                .map(CardResponse::from)
                .collect(Collectors.toList());
    }

    private Card getOwnedCardOrThrow(Long cardId) {
        List<Account> myAccounts = accountService.getMyAccountEntities();
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "البطاقة غير موجودة"));

        boolean owns = myAccounts.stream().anyMatch(a -> a.getId().equals(card.getAccount().getId()));
        if (!owns) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "لا تملك صلاحية الوصول لهذه البطاقة");
        }
        return card;
    }

    public CardRevealResponse revealCard(Long cardId) {
        Card card = getOwnedCardOrThrow(cardId);
        String formatted = card.getCardNumber().replaceAll("(.{4})(?=.)", "$1  ");
        return new CardRevealResponse(formatted, card.getCvv());
    }

    @Transactional
    public CardResponse setFrozen(Long cardId, boolean frozen) {
        Card card = getOwnedCardOrThrow(cardId);
        card.setFrozen(frozen);
        cardRepository.save(card);
        return CardResponse.from(card);
    }

    @Transactional
    public CardResponse updateDailyLimit(Long cardId, double dailyLimit) {
        Card card = getOwnedCardOrThrow(cardId);
        card.setDailyLimit(dailyLimit);
        cardRepository.save(card);
        return CardResponse.from(card);
    }
}
