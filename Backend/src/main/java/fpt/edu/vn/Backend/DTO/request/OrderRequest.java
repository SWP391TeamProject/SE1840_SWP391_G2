package fpt.edu.vn.Backend.DTO.request;


import fpt.edu.vn.Backend.DTO.PaymentDTO;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class OrderRequest {
    private int orderId;
    private int itemId;
    private int paymentId;

}
