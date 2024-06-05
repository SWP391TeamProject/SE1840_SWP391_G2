package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.OrderDTO;

import java.util.List;

public interface OrderService {
    OrderDTO createOrder(OrderDTO orderDTO);
    OrderDTO getOrderById(int orderId);
    List<OrderDTO> getAllOrders();
    OrderDTO updateOrder(int orderId, OrderDTO orderDTO);
    void deleteOrder(int orderId);
}
