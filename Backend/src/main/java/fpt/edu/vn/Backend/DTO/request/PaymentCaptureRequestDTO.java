package fpt.edu.vn.Backend.DTO.request;

import fpt.edu.vn.Backend.pojo.Payment;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class PaymentCaptureRequestDTO {
    private String orderId;
    private Payment.Method method;
}
