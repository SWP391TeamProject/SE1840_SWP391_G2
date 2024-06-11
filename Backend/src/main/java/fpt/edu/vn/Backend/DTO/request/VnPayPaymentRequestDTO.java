package fpt.edu.vn.Backend.DTO.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VnPayPaymentRequestDTO implements Serializable {
    private int accountId;
    private BigDecimal vnp_Amount;
    private String vnp_OrderInfo;
    private int vnp_txnRef;

    public  enum OrderInfoType {
         DEPOSIT, ORDER
    }
    // Getters and setters for all fields
    // ...
}