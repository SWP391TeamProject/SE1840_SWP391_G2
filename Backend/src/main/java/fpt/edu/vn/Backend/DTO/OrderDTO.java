package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Order;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@NoArgsConstructor
@Data
public class OrderDTO implements Serializable {
    private int orderId;
    private String shippingAddress;
    private PaymentDTO payment;
    private LocalDateTime createDate;

    public OrderDTO(Order order){
        this.orderId = order.getOrderId();
        this.payment = new PaymentDTO(order.getPayment());
        this.shippingAddress = order.getShippingAddress();
    }
}