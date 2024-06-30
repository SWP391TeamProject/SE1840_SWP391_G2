package fpt.edu.vn.Backend.DTO.request;


import fpt.edu.vn.Backend.DTO.PaymentDTO;
import lombok.*;

import java.io.Serializable;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class OrderRequest implements Serializable {
    private int orderId;
    private Set<Integer> itemId;
    private int paymentId;

}
