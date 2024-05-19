package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Order;
import lombok.Data;

import java.time.LocalDateTime;
@Data
public class OrderDTO {
    private int orderId;
    private int userId;
    private LocalDateTime orderDate;
    private String shipAddress;

    OrderDTO(Order order){
        this.orderId = order.getOrderId();
        this.userId = order.getAccount().getAccountId();
        this.orderDate = order.getOrderDate();
        this.shipAddress = order.getShipAddress();

    }
    // getters and setters
    // ...
}