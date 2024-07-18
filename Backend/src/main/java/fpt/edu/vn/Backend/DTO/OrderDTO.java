package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Order;
import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

@NoArgsConstructor
@Data
public class OrderDTO implements Serializable {
    private int orderId;
    private Set<ItemDTO> itemDTOS;
    private BigDecimal fee;
    private String shippingAddress;
    private String shippingNote;
    private Order.ShippingStatus shippingStatus;
    private PaymentDTO payment;
    private LocalDateTime createDate;

    public OrderDTO(Order order){
        this.orderId = order.getOrderId();
        this.itemDTOS = order.getItems().stream().map(ItemDTO::new).collect(Collectors.toSet());
        this.fee = order.getFee();
        this.payment = new PaymentDTO(order.getPayment());
        this.shippingAddress = order.getShippingAddress();
        this.shippingNote = order.getShippingNote();
        this.shippingStatus = order.getShippingStatus();
        this.createDate = order.getPayment().getCreateDate();
    }
}