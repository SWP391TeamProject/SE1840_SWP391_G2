package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Order;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

@NoArgsConstructor
@Data
public class OrderDTO implements Serializable {
    private int orderId;
    private Set<ItemDTO> itemDTOS;
    private String shippingAddress;
    private PaymentDTO payment;
    private LocalDateTime createDate;

    public OrderDTO(Order order){
        this.orderId = order.getOrderId();
        this.itemDTOS = order.getItems().stream().map(ItemDTO::new).collect(Collectors.toSet());
        this.payment = new PaymentDTO(order.getPayment());
        this.shippingAddress = order.getShippingAddress();
        this.createDate = order.getPayment().getCreateDate();
    }
}