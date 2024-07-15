package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.OrderDTO;
import fpt.edu.vn.Backend.DTO.request.OrderRequest;
import fpt.edu.vn.Backend.DTO.request.UpdateOrderStatusRequestDTO;
import fpt.edu.vn.Backend.exception.ConsignmentServiceException;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.*;
import fpt.edu.vn.Backend.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
public class OrderServiceImpl implements OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderServiceImpl.class);
    private final OrderRepos orderRepository;
    private final ItemRepos itemRepository;
    private final PaymentRepos paymentRepository;
    private final AuctionSessionRepos auctionSessionRepos;
    private final AccountRepos accountRepos;
    private final AuctionItemRepos auctionItemRepos;

    @Autowired
    public OrderServiceImpl(OrderRepos orderRepository, ItemRepos itemRepository, PaymentRepos paymentRepository, AuctionSessionRepos auctionSessionRepos, AccountRepos accountRepos, AuctionItemRepos auctionItemRepos) {
        this.orderRepository = orderRepository;
        this.itemRepository = itemRepository;
        this.paymentRepository = paymentRepository;
        this.auctionSessionRepos = auctionSessionRepos;
        this.accountRepos = accountRepos;
        this.auctionItemRepos = auctionItemRepos;
    }


    @Override
    @Transactional
    public OrderDTO createOrder(int accountId, Set<AuctionItemId> itemIds, int auctionId) {
        try {
            Order order = new Order();
            AuctionSession auctionSession = auctionSessionRepos.findById(auctionId).orElseThrow(() -> new RuntimeException("Auction not found"));
            Payment payment = new Payment();
            payment.setCreateDate(LocalDateTime.now());
            payment.setType(Payment.Type.AUCTION_ORDER);
            payment.setStatus(Payment.Status.PENDING);
            payment.setAccount(accountRepos.findById(accountId).orElseThrow(() -> new RuntimeException("Account not found")));
            payment.setPaymentAmount(BigDecimal.ZERO);
            for (AuctionItemId auctionItemId : itemIds) {
                AuctionItem ai = auctionItemRepos.findById(auctionItemId).orElseThrow(() -> new RuntimeException("Item not found"));
                payment.setPaymentAmount(payment.getPaymentAmount().add(ai.getCurrentPrice()));
            }
            BigDecimal winnerDeposit = auctionSession
                    .getDeposits().stream()
                    .filter(d -> d.getPayment().getAccount().getAccountId() == (accountId))
                    .findFirst().orElseThrow(() -> new RuntimeException("Deposit not found"))
                    .getPayment().getPaymentAmount();
            payment.setPaymentAmount((payment.getPaymentAmount().multiply(BigDecimal.valueOf(1.045)).subtract(winnerDeposit)));
            payment = paymentRepository.save(payment);
            order.setPayment(payment);
            order = orderRepository.save(order);
            for (AuctionItemId auctionItemId : itemIds) {
                AuctionItem ai = auctionItemRepos.findById(auctionItemId).orElseThrow(() -> new RuntimeException("Item not found"));
                Item item = ai.getItem();
                item.setOrder(order);
                itemRepository.save(item);
            }
            return new OrderDTO(order);
        } catch (Exception e) {
            // Log the exception (using a logging framework is recommended)
            System.err.println("An error occurred while creating order: " + e.getMessage());
            throw new RuntimeException("Failed to create order", e);
        }
    }

    @Override
    public OrderDTO getOrderById(int orderId) {
        try {
            Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
            return new OrderDTO(order);
        } catch (Exception e) {
            System.err.println("An error occurred while fetching order by ID: " + e.getMessage());
            throw new RuntimeException("Failed to fetch order by ID", e);
        }
    }

    @Override
    public Page<OrderDTO> getAllOrders(Pageable pageable) {
        try {
            return orderRepository.findAll(pageable)
                    .map(OrderDTO::new);
        } catch (Exception e) {
            System.err.println("An error occurred while fetching all orders: " + e.getMessage());
            throw new RuntimeException("Failed to fetch all orders", e);
        }
    }

    @Override
    public Page<OrderDTO> getAllOrdersByUserId(int userId, Pageable pageable) {
        try {
            return orderRepository.findAllByPayment_Account_AccountId(userId, pageable)
                    .map(OrderDTO::new);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch orders by user ID", e);
        }
    }

    @Override
    public Page<OrderDTO> getAllOrdersByStatus(Payment.Status status, Pageable pageable) {
        try {
            return orderRepository.findAllByPayment_Status(status, pageable)
                    .map(OrderDTO::new);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch all orders", e);
        }
    }

    @Override
    public Page<OrderDTO> getAllOrdersByUserIdAndStatus(int userId, Payment.Status status, Pageable pageable) {
        try {
            return orderRepository.findAllByPayment_Account_AccountIdAndPayment_Status(userId, status, pageable)
                    .map(OrderDTO::new);
        } catch (Exception e) {
            System.err.println("An error occurred while fetching all orders: " + e.getMessage());
            throw new RuntimeException("Failed to fetch all orders", e);
        }
    }

    @Override
    public OrderDTO updateOrderShippingAddress(String ship_address, int orderId) {
        try {
            Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
            order.setShippingAddress(ship_address);
            order = orderRepository.save(order);
            return new OrderDTO(order);
        } catch (Exception e) {
            System.err.println("An error occurred while updating order: " + e.getMessage());
            throw new RuntimeException("Failed to update order", e);
        }
    }

    @Override
    public void deleteOrder(int orderId) {
        try {
            Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
            orderRepository.delete(order);
        } catch (Exception e) {
            System.err.println("An error occurred while deleting order: " + e.getMessage());
            throw new RuntimeException("Failed to delete order", e);
        }
    }

    @Override
    public void updateOrderByStatus(UpdateOrderStatusRequestDTO request) {
        for (Integer orderId : request.getOrderId()) {
            try {
                Optional<Order> order = orderRepository.findById(orderId);
                Order orders = order.get();
                if (orders != null) {
//                    orders.setStatus(Item.Status.valueOf(request.getStatus().toUpperCase()));
                    orderRepository.save(orders);
                } else {
                    throw new ResourceNotFoundException("Order not found with ID: " + orderId);
                }
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid status value: " + request.getStatus().toUpperCase());
            } catch (Exception e) {
                throw new ConsignmentServiceException("An error occurred while updating order with ID: " + orderId);
            }
        }
    }
}
