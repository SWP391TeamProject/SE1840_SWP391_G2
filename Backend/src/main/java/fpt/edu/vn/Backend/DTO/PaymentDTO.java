package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Payment;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@NoArgsConstructor
@Data
public class PaymentDTO {
    private int id;
    private BigDecimal amount = BigDecimal.ZERO;
    private LocalDateTime date;
    private Payment.Type type;
    private Payment.Status status;
    private int accountId;

    public PaymentDTO(Payment payment) {
        if (payment == null) return;
        this.id = payment.getPaymentId();
        this.amount = payment.getPaymentAmount() != null ? payment.getPaymentAmount() : BigDecimal.ZERO;
        this.date = payment.getCreateDate();
        this.type = payment.getType();
        this.status = payment.getStatus();
        this.accountId = payment.getAccount().getAccountId();
    }


}
