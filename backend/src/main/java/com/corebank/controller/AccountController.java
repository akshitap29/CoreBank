
package com.corebank.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.corebank.entity.Account;
import com.corebank.service.AccountService;

import java.math.BigDecimal;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.corebank.dto.DepositRequest;

import com.corebank.dto.WithdrawalRequest;

import java.util.List;
import com.corebank.entity.Transaction;

import com.corebank.dto.TransactionResponse;
import com.corebank.dto.TransferRequest;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping("/me")
    public Map<String, Object> getMyAccount(
            @AuthenticationPrincipal Jwt jwt) {

        Long userId = Long.valueOf(jwt.getSubject());

        Account account = accountService.getAccountByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Account not found"));

        return Map.of(
                "accountId", account.getId(),
                "userId", account.getUserId(),
                "balance", account.getBalance()
        );
    }
    @PostMapping("/deposit")
    public Map<String, Object> deposit(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody DepositRequest request) {

        Long userId = Long.valueOf(jwt.getSubject());

        Account account = accountService.deposit(
                userId, request.getAmount());

        return Map.of(
                "message", "Deposit successful",
                "accountId", account.getId(),
                "balance", account.getBalance()
        );
    }

    @PostMapping("/withdraw")
    public Map<String, Object> withdraw(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody WithdrawalRequest request) {

        Long userId = Long.valueOf(jwt.getSubject());

        Account account = accountService.withdraw(
                userId, request.getAmount());

        return Map.of(
                "message", "Withdrawal successful",
                "accountId", account.getId(),
                "balance", account.getBalance()
        );
    }


    @GetMapping("/transactions")
    public List<TransactionResponse> getTransactionHistory(
            @AuthenticationPrincipal Jwt jwt) {

        Long userId = Long.valueOf(jwt.getSubject());

        return accountService.getTransactionHistory(userId);
    }


    @PostMapping("/transfer")
    public Map<String, Object> transfer(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody TransferRequest request) {

        Long senderUserId = Long.valueOf(jwt.getSubject());

        return accountService.transfer(
                senderUserId,
                request.getRecipientUserId(),
                request.getAmount());
    }



}
