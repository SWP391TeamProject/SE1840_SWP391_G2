package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.OrderDTO;
import fpt.edu.vn.Backend.DTO.request.OrderRequest;
import fpt.edu.vn.Backend.pojo.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Set;

public interface OrderService {
    OrderDTO createOrder(int accountId, Set<Integer> itemIds, int auctionId);

    OrderDTO getOrderById(int orderId);

    Page<OrderDTO> getAllOrders(Pageable pageable);

    Page<OrderDTO> getAllOrdersByUserId(int userId, Pageable pageable);

    Page<OrderDTO> getAllOrdersByStatus(Payment.Status status, Pageable pageable);

    Page<OrderDTO> getAllOrdersByUserIdAndStatus(int userId, Payment.Status status, Pageable pageable);

    OrderDTO updateOrder(OrderRequest orderRequest);

    void deleteOrder(int orderId);
}
