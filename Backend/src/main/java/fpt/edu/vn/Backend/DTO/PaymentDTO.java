package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Payment;

import java.math.BigDecimal;

public class PaymentDTO {
    private int paymentId;
    private BigDecimal paymentAmount;
    private String paymentDate;
    private DepositDTO deposit;

    public PaymentDTO(Payment payment) {
        this.paymentId = payment.getPaymentId();
        this.paymentAmount = payment.getPaymentAmount() != null ? payment.getPaymentAmount() : BigDecimal.ZERO; // Default to 0 if null
        this.paymentDate = payment.getPaymentDate() != null ? payment.getPaymentDate() : "default_date"; // Provide a default date if needed
        this.deposit = null; // Initialize deposit with null to break the circular dependency
    }

    public void setDeposit(DepositDTO deposit) {
        this.deposit = deposit;
    }
}
