package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Order;
import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@Data
public class OrderDTO {
    private int orderId;
    private int itemId;
    private PaymentDTO payment;

    public OrderDTO(Order order){
        this.orderId = order.getOrderId();
        this.itemId = order.getItem().getItemId();
        this.payment = new PaymentDTO(order.getPayment());
    }
}