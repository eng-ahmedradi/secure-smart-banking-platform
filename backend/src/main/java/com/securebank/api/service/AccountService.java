package com.securebank.api.service;

import com.securebank.api.dto.AccountResponse;
import com.securebank.api.model.Account;
import com.securebank.api.model.User;
import com.securebank.api.repository.AccountRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final CurrentUserService currentUserService;

    public AccountService(AccountRepository accountRepository, CurrentUserService currentUserService) {
        this.accountRepository = accountRepository;
        this.currentUserService = currentUserService;
    }

    public List<AccountResponse> getMyAccounts() {
        User user = currentUserService.getCurrentUser();
        return accountRepository.findByUser(user).stream()
                .map(AccountResponse::from)
                .collect(Collectors.toList());
    }

    public List<Account> getMyAccountEntities() {
        User user = currentUserService.getCurrentUser();
        return accountRepository.findByUser(user);
    }

    public Account getOwnedAccountOrThrow(Long accountId) {
        User user = currentUserService.getCurrentUser();
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "الحساب غير موجود"));

        if (!account.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "لا تملك صلاحية الوصول لهذا الحساب");
        }
        return account;
    }

    public AccountResponse getAccount(Long accountId) {
        return AccountResponse.from(getOwnedAccountOrThrow(accountId));
    }
}
