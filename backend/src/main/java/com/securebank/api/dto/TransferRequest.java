package com.securebank.api.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class TransferRequest {
    @NotNull
    private Long sourceAccountId;

    @NotBlank(message = "القناة مطلوبة: internal أو ipn أو iban")
    private String channel;

    @NotBlank(message = "بيانات المستلم مطلوبة")
    private String recipient;

    @NotNull
    @DecimalMin(value = "0.01", message = "المبلغ يجب أن يكون أكبر من صفر")
    private BigDecimal amount;

    public Long getSourceAccountId() { return sourceAccountId; }
    public void setSourceAccountId(Long sourceAccountId) { this.sourceAccountId = sourceAccountId; }
    public String getChannel() { return channel; }
    public void setChannel(String channel) { this.channel = channel; }
    public String getRecipient() { return recipient; }
    public void setRecipient(String recipient) { this.recipient = recipient; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
}
