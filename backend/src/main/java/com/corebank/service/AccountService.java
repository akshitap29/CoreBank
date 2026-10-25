
package com.corebank.service;

import java.math.BigDecimal;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import com.corebank.entity.Account;
import com.corebank.entity.Transaction;
import com.corebank.repository.AccountRepository;
import com.corebank.repository.TransactionRepository;

import java.util.List;

import com.corebank.dto.TransactionResponse;
import java.util.stream.Collectors;

import java.util.Map;
import java.util.HashMap;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public AccountService(
            AccountRepository accountRepository,
            TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    public Optional<Account> getAccountByUserId(Long userId) {
        return accountRepository.findByUserId(userId);
    }

    @Transactional
    public Account deposit(Long userId, BigDecimal amount) {

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                    "Amount must be greater than zero");
        }

        Account account = accountRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Account not found"));

        account.setBalance(account.getBalance().add(amount));
        accountRepository.save(account);

        Transaction transaction = new Transaction();
        transaction.setToAccountId(account.getId());
        transaction.setType("DEPOSIT");
        transaction.setAmount(amount);

        transactionRepository.save(transaction);

        return account;
    }

    @Transactional
    public Account withdraw(Long userId, BigDecimal amount) {

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                    "Amount must be greater than zero");
        }

        Account account = accountRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Account not found"));

        if (account.getBalance().compareTo(amount) < 0) {
            throw new IllegalArgumentException(
                    "Insufficient balance");
        }

        account.setBalance(account.getBalance().subtract(amount));
        accountRepository.save(account);

        Transaction transaction = new Transaction();
        transaction.setFromAccountId(account.getId());
        transaction.setType("WITHDRAWAL");
        transaction.setAmount(amount);

        transactionRepository.save(transaction);

        return account;
    }


    public List<TransactionResponse> getTransactionHistory(Long userId) {

        Account account = accountRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Account not found"));

        return transactionRepository
                .findByFromAccountIdOrToAccountIdOrderByCreatedAtDesc(
                        account.getId(), account.getId())
                .stream()
                .map(transaction -> new TransactionResponse(
                        transaction.getId(),
                        transaction.getType(),
                        transaction.getAmount(),
                        transaction.getFromAccountId(),
                        transaction.getToAccountId(),
                        transaction.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> transfer(
            Long senderUserId,
            Long recipientUserId,
            BigDecimal amount) {

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                    "Amount must be greater than zero");
        }

        if (senderUserId.equals(recipientUserId)) {
            throw new IllegalArgumentException(
                    "Cannot transfer to your own account");
        }

        Account sender = accountRepository.findByUserId(senderUserId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Sender account not found"));

        Account recipient = accountRepository.findByUserId(recipientUserId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Recipient account not found"));

        if (sender.getBalance().compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient balance");
        }

        sender.setBalance(sender.getBalance().subtract(amount));
        recipient.setBalance(recipient.getBalance().add(amount));

        accountRepository.save(sender);
        accountRepository.save(recipient);

        Transaction transaction = new Transaction();
        transaction.setFromAccountId(sender.getId());
        transaction.setToAccountId(recipient.getId());
        transaction.setType("TRANSFER");
        transaction.setAmount(amount);
        transactionRepository.save(transaction);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Transfer successful");
        response.put("senderBalance", sender.getBalance());
        response.put("recipientBalance", recipient.getBalance());

        return response;
    }




}
