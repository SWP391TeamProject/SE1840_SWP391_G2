package fpt.edu.vn.Backend.DTO.request;

import fpt.edu.vn.Backend.pojo.Payment;
import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder

public class PaymentRequest implements Serializable {
    private int paymentId;
    private BigDecimal amount;
    private Payment.Type type;
    private Payment.Status status;
    private Payment.Method method;
    private int accountId;
    private String ipAddr;
    private VnPayPaymentRequestDTO.OrderInfoType orderInfoType;
}
