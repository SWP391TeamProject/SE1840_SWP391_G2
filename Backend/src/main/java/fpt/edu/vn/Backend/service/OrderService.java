package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.OrderDTO;
import fpt.edu.vn.Backend.DTO.request.OrderRequest;

import java.util.List;

public interface OrderService {
    OrderDTO createOrder(OrderRequest orderRequest);
    OrderDTO getOrderById(int orderId);
    List<OrderDTO> getAllOrders();
    OrderDTO updateOrder(OrderRequest orderRequest);
    void deleteOrder(int orderId);
}
