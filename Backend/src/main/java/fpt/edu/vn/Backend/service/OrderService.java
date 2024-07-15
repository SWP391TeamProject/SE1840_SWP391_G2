package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.OrderDTO;
import fpt.edu.vn.Backend.DTO.request.UpdateOrderStatusRequestDTO;
import fpt.edu.vn.Backend.pojo.AuctionItemId;
import fpt.edu.vn.Backend.pojo.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Set;

public interface OrderService {
    OrderDTO createOrder(int accountId, Set<AuctionItemId> itemIds, int auctionId);

    OrderDTO getOrderById(int orderId);

    Page<OrderDTO> getAllOrders(Pageable pageable);

    Page<OrderDTO> getAllOrdersByUserId(int userId, Pageable pageable);

    Page<OrderDTO> getAllOrdersByStatus(Payment.Status status, Pageable pageable);

    Page<OrderDTO> getAllOrdersByUserIdAndStatus(int userId, Payment.Status status, Pageable pageable);

    OrderDTO updateOrderShippingAddress(String shippingAddress, int orderId);

    void deleteOrder(int orderId);

    void updateOrderByStatus(UpdateOrderStatusRequestDTO request);
}
