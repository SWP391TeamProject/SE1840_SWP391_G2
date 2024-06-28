package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.OrderDTO;
import fpt.edu.vn.Backend.DTO.request.OrderRequest;
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
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService{

    private static final Logger log = LoggerFactory.getLogger(OrderServiceImpl.class);
    private final OrderRepos orderRepository;
    private final ItemRepos itemRepository;
    private final PaymentRepos paymentRepository;
    private final AuctionSessionRepos auctionSessionRepos;
    private final AccountRepos accountRepos;

    @Autowired
    public OrderServiceImpl(OrderRepos orderRepository, ItemRepos itemRepository, PaymentRepos paymentRepository, AuctionSessionRepos auctionSessionRepos, AccountRepos accountRepos) {
        this.orderRepository = orderRepository;
        this.itemRepository = itemRepository;
        this.paymentRepository = paymentRepository;
        this.auctionSessionRepos = auctionSessionRepos;
        this.accountRepos = accountRepos;
    }


    @Override
    @Transactional
    public OrderDTO createOrder(int accountId, Set<Integer> itemIds,int auctionId) {
        try {
            Order order = new Order();
            Set<Item> items = new HashSet<>();
            for (int itemId : itemIds) {
                items.add(itemRepository.findById(itemId).orElseThrow(() -> new RuntimeException("Item not found")));
            }
            AuctionSession auctionSession = auctionSessionRepos.findById(auctionId).orElseThrow(() -> new RuntimeException("Auction not found"));
            order.setItems(items);
            Payment payment = new Payment();
            payment.setCreateDate(LocalDateTime.now());
            payment.setType(Payment.Type.AUCTION_ORDER);
            payment.setStatus(Payment.Status.PENDING);
            payment.setAccount(accountRepos.findById(accountId).orElseThrow(() -> new RuntimeException("Account not found")));
            payment.setPaymentAmount(BigDecimal.ZERO);
            for(AuctionItem item: auctionSession.getAuctionItems()){
                if(items.stream().anyMatch(i -> i.getItemId().equals(item.getItem().getItemId()))){
                    log.info("Item: {} - {}", item.getItem().getItemId(), item.getCurrentPrice());
                    payment.setPaymentAmount(payment.getPaymentAmount().add(item.getCurrentPrice()));
                }
            }
            BigDecimal winnerDeposit = auctionSession
                    .getDeposits().stream()
                    .filter(d -> d.getPayment().getAccount().getAccountId()==(accountId))
                    .findFirst().orElseThrow(() -> new RuntimeException("Deposit not found"))
                    .getPayment().getPaymentAmount();
            payment.setPaymentAmount(payment.getPaymentAmount().multiply(BigDecimal.valueOf(1.045).subtract(winnerDeposit)));
            payment = paymentRepository.save(payment);
            order.setPayment(payment);
            order = orderRepository.save(order);
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
            return orderRepository.findAll(pageable).map(OrderDTO::new);
        } catch (Exception e) {
            System.err.println("An error occurred while fetching all orders: " + e.getMessage());
            throw new RuntimeException("Failed to fetch all orders", e);
        }
    }

    @Override
    public OrderDTO updateOrder(OrderRequest orderRequest) {
        try {
            Order order = orderRepository.findById(orderRequest.getOrderId()).orElseThrow(() -> new RuntimeException("Order not found"));
            Set<Item> items = new HashSet<>();
            for (int itemId : orderRequest.getItemId()) {
                items.add(itemRepository.findById(itemId).orElseThrow(() -> new RuntimeException("Item not found")));
            }
            order.setItems(items);
            order.setPayment(paymentRepository.findById(orderRequest.getPaymentId()).orElseThrow(() -> new RuntimeException("Payment not found")));
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
}
