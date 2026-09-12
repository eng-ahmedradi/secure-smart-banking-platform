package com.securebank.api.service;

import com.securebank.api.dto.AuthResponse;
import com.securebank.api.dto.LoginRequest;
import com.securebank.api.dto.RegisterRequest;
import com.securebank.api.model.Account;
import com.securebank.api.model.User;
import com.securebank.api.repository.AccountRepository;
import com.securebank.api.repository.UserRepository;
import com.securebank.api.security.JwtService;
import com.securebank.api.util.GeneratorUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.math.BigDecimal;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsServiceImpl userDetailsService;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                        AccountRepository accountRepository,
                        PasswordEncoder passwordEncoder,
                        AuthenticationManager authenticationManager,
                        UserDetailsServiceImpl userDetailsService,
                        JwtService jwtService) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByUsername(req.getUsername())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "اسم المستخدم مستخدم بالفعل");
        }
        if (req.getEmail() != null && !req.getEmail().isBlank() && userRepository.existsByEmail(req.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "البريد الإلكتروني مستخدم بالفعل");
        }

        User user = new User();
        user.setFullName(req.getFullName());
        user.setUsername(req.getUsername());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setEmail(req.getEmail());
        user.setPhone(req.getPhone());
        user = userRepository.save(user);

        // Every new customer starts with one checking account and a small opening balance, like the demo dashboard.
        Account account = new Account();
        account.setUser(user);
        account.setAccountNumber(uniqueAccountNumber());
        account.setIban(GeneratorUtil.iban(account.getAccountNumber()));
        account.setAccountType("CHECKING");
        account.setBalance(new BigDecimal("5000.00"));
        accountRepository.save(account);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String token = jwtService.generateToken(userDetails);
        return new AuthResponse(token, jwtService.getExpirationMs(), user.getUsername(), user.getFullName());
    }

    public AuthResponse login(LoginRequest req) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
            );
        } catch (BadCredentialsException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "بيانات الدخول غير صحيحة");
        }

        User user = userRepository.findByUsername(req.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "بيانات الدخول غير صحيحة"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String token = jwtService.generateToken(userDetails);
        return new AuthResponse(token, jwtService.getExpirationMs(), user.getUsername(), user.getFullName());
    }

    private String uniqueAccountNumber() {
        String number;
        do {
            number = GeneratorUtil.accountNumber();
        } while (accountRepository.existsByAccountNumber(number));
        return number;
    }
}
