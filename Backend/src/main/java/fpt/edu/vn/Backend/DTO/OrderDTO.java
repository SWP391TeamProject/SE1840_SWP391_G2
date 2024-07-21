package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Order;
import fpt.edu.vn.Backend.pojo.OrderDetail;
import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@NoArgsConstructor
@Data
public class OrderDTO implements Serializable {
    private int orderId;
    private BigDecimal fee;
    private String shippingAddress;
    private String shippingNote;
    private Order.ShippingStatus shippingStatus;
    private PaymentDTO payment;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;
    private List<OrderDetailDTO> orderDetails = new ArrayList<>();
    private BigDecimal subtotal;

    public static OrderDTO detailed(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.orderId = order.getOrderId();
        dto.fee = order.getFee();
        dto.payment = new PaymentDTO(order.getPayment());
        dto.shippingAddress = order.getShippingAddress();
        dto.shippingNote = order.getShippingNote();
        dto.shippingStatus = order.getShippingStatus();
        if (order.getOrderDetails() != null) {
            dto.orderDetails = order.getOrderDetails().stream().map(OrderDetailDTO::full).collect(Collectors.toList());
            dto.subtotal = order.getOrderDetails().stream()
                    .reduce(BigDecimal.ZERO, (a, b) -> a.add(b.getSoldPrice()), BigDecimal::add);
        }
        dto.createDate = order.getPayment().getCreateDate();
        dto.updateDate = order.getUpdateDate();
        if (dto.updateDate == null) dto.updateDate = dto.createDate;
        return dto;
    }

    public OrderDTO(Order order){
        this.orderId = order.getOrderId();
        this.fee = order.getFee();
        this.payment = new PaymentDTO(order.getPayment());
        this.shippingAddress = order.getShippingAddress();
        this.shippingNote = order.getShippingNote();
        this.shippingStatus = order.getShippingStatus();
        if (order.getOrderDetails() != null) {
            this.orderDetails = order.getOrderDetails().stream().map(OrderDetailDTO::minimal).collect(Collectors.toList());
            this.subtotal = order.getOrderDetails().stream()
                    .reduce(BigDecimal.ZERO, (a, b) -> a.add(b.getSoldPrice()), BigDecimal::add);
        }
        this.createDate = order.getPayment().getCreateDate();
        this.updateDate = order.getUpdateDate();
        if (this.updateDate == null) this.updateDate = this.createDate;
    }
}