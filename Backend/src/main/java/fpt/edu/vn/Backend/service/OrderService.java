package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.OrderDTO;
import fpt.edu.vn.Backend.DTO.request.OrderRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface OrderService {
    OrderDTO createOrder(OrderRequest orderRequest);
    OrderDTO getOrderById(int orderId);
    Page<OrderDTO> getAllOrders(Pageable pageable);
    OrderDTO updateOrder(OrderRequest orderRequest);
    void deleteOrder(int orderId);
}
