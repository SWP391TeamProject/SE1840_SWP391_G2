package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Payment;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PaymentDTO {
    private int paymentId;
    private BigDecimal paymentAmount;
    private String paymentDate;
    private int depositId;

    public PaymentDTO(Payment payment) {
        if (payment != null) {
            this.paymentId = payment.getPaymentId();
            this.paymentAmount = payment.getPaymentAmount() != null ? payment.getPaymentAmount() : BigDecimal.ZERO; // Default to 0 if null
            this.paymentDate = payment.getPaymentDate() != null ? payment.getPaymentDate() : "default_date"; // Provide a default date if needed
            this.depositId = payment.getDeposit().getDepositId(); // Initialize deposit with null to break the circular dependency
        }
    }


}
