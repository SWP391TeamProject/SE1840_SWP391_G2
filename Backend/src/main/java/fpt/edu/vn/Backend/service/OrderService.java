package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.OrderDTO;
import fpt.edu.vn.Backend.DTO.request.OrderPayRequestDTO;
import fpt.edu.vn.Backend.DTO.request.OrderUpdateDTO;
import fpt.edu.vn.Backend.pojo.AuctionItemId;
import fpt.edu.vn.Backend.pojo.AuctionSession;
import fpt.edu.vn.Backend.pojo.Order;
import fpt.edu.vn.Backend.pojo.Payment;
import org.jetbrains.annotations.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public interface OrderService {
    OrderDTO createOrder(int accountId, Set<AuctionItemId> itemIds);

    OrderDTO getOrderById(int orderId);

    OrderDTO payOrder(int accountId, int orderId, OrderPayRequestDTO dto);

    void cancelOrder(Order order);

    Page<OrderDTO> getAllOrders(Pageable pageable,
                                @Nullable Payment.Status status,
                                @Nullable Order.ShippingStatus shippingStatus,
                                @Nullable LocalDateTime fromDate, @Nullable LocalDateTime toDate,
                                @Nullable Integer accountId,
                                @Nullable String keyword);

    Page<OrderDTO> getAllOrdersByUserId(int userId, Pageable pageable);

    Page<OrderDTO> getAllOrdersByStatus(Payment.Status status, Pageable pageable);

    Page<OrderDTO> getAllOrdersByUserIdAndStatus(int userId, Payment.Status status, Pageable pageable);


    OrderDTO updateOrder(int id, OrderUpdateDTO dto);

    void linkAuctionToOrders(AuctionSession auction, List<OrderDTO> orderList);
}
