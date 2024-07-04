package fpt.edu.vn.Backend.DTO.request;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class PayPalPaymentRequestDTO {
    private int accountId;
    private BigDecimal amount;
    private String orderInfo;
    private int transId;
}
