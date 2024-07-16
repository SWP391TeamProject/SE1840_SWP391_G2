package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Payment;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@NoArgsConstructor
@Data
@ToString
public class PaymentDTO implements Serializable {
    private int id;
    private BigDecimal paymentAmount;
    private LocalDateTime createDate;
    private Payment.Type type;
    private Payment.Status status;
    private Payment.Method method;
    private int accountId;
    public PaymentDTO(Payment payment) {
        if (payment == null) return;
        this.id = payment.getPaymentId();
        this.paymentAmount = payment.getPaymentAmount();
        this.createDate = payment.getCreateDate();
        this.type = payment.getType();
        this.status = payment.getStatus();
        this.method = payment.getMethod();
        this.accountId = payment.getAccount().getAccountId()    ;
    }
}