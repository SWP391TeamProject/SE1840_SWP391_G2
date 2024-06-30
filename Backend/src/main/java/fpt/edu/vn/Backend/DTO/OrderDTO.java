package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Order;
import lombok.*;

import java.io.Serializable;
import java.util.Set;
import java.util.stream.Collectors;

@NoArgsConstructor
@Data
public class OrderDTO implements Serializable {
    private int orderId;
    private Set<ItemDTO> item;
    private PaymentDTO payment;

    public OrderDTO(Order order){
        this.orderId = order.getOrderId();
        this.item = order.getItems().stream().map(ItemDTO::new).collect(Collectors.toSet());
        this.payment = new PaymentDTO(order.getPayment());
    }
}