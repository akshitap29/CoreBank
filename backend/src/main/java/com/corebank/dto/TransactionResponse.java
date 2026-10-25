
package com.corebank.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionResponse {

    private Long id;
    private String type;
    private BigDecimal amount;
    private Long fromAccountId;
    private Long toAccountId;
    private LocalDateTime createdAt;

    public TransactionResponse(
            Long id,
            String type,
            BigDecimal amount,
            Long fromAccountId,
            Long toAccountId,
            LocalDateTime createdAt) {
        this.id = id;
        this.type = type;
        this.amount = amount;
        this.fromAccountId = fromAccountId;
        this.toAccountId = toAccountId;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getType() { return type; }
    public BigDecimal getAmount() { return amount; }
    public Long getFromAccountId() { return fromAccountId; }
    public Long getToAccountId() { return toAccountId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
