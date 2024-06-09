package fpt.edu.vn.Backend.DTO.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import fpt.edu.vn.Backend.pojo.Payment;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder

public class PaymentRequest {
    private int paymentId;
    private BigDecimal amount;
    private Payment.Type type;
    private Payment.Status status;
    private int accountId;
    private String ipAddr;
    private VnPayPaymentRequestDTO.OrderInfoType orderInfoType;
}
