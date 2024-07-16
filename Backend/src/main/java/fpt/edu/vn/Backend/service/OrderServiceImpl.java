package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.NotificationDTO;
import fpt.edu.vn.Backend.DTO.OrderDTO;
import fpt.edu.vn.Backend.DTO.request.UpdateOrderStatusRequestDTO;
import fpt.edu.vn.Backend.exception.ConsignmentServiceException;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.*;
import fpt.edu.vn.Backend.repository.*;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.CompletableFuture;

@Service
public class OrderServiceImpl implements OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderServiceImpl.class);
    private final OrderRepos orderRepository;
    private final PaymentRepos paymentRepository;
    private final AccountRepos accountRepos;
    private final AuctionItemRepos auctionItemRepos;
    private final NotificationService notificationService;
    private final JavaMailSender mailSender;
    @Value("${app.email}")
    private String systemEmail;

    @Autowired
    public OrderServiceImpl(OrderRepos orderRepository, PaymentRepos paymentRepository,
                            AccountRepos accountRepos, AuctionItemRepos auctionItemRepos,
                            NotificationService notificationService, JavaMailSender mailSender) {
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.accountRepos = accountRepos;
        this.auctionItemRepos = auctionItemRepos;
        this.notificationService = notificationService;
        this.mailSender = mailSender;
    }

    @Override
    @Transactional
    public OrderDTO createOrder(int accountId, Set<AuctionItemId> itemIds, int auctionId) {
        try {
            Account account = accountRepos.findById(accountId)
                    .orElseThrow(() -> new ResourceNotFoundException("Account not found", "id", accountId));
            BigDecimal totalPay = BigDecimal.ZERO;

            Order order = new Order();
            order.setItems(new HashSet<>());
            for (AuctionItemId itemId : itemIds) {
                AuctionItem item = auctionItemRepos.findById(itemId)
                        .orElseThrow(() -> new ResourceNotFoundException("Auction Item not found", "id", itemId));
                order.getItems().add(item.getItem());
                totalPay = totalPay.add(item.getCurrentPrice());
            }

            Payment payment = new Payment();
            payment.setType(Payment.Type.AUCTION_ORDER);
            payment.setStatus(Payment.Status.PENDING);
            payment.setAccount(account);
            payment.setPaymentAmount(totalPay.multiply(BigDecimal.valueOf(1.045)));
            payment = paymentRepository.save(payment);

            order.setPayment(payment);
            order = orderRepository.save(order);

            log.info("Order {} account {} must pay {}", order.getOrderId(), accountId, payment.getPaymentAmount());

            notificationService.sendNotificationToUserGroup(
                    NotificationDTO.builder()
                            .message(String.format(
                                    "A new order worth $%s was created",
                                    payment.getPaymentAmount()
                            ))
                            .build(),
                    Account.Role.MANAGER, Account.Role.ADMIN
            );

            notificationService.sendNotification(
                    NotificationDTO.builder()
                            .message(String.format(
                                    "An order worth $%s was issued. Please pay for it in 7 days.",
                                    payment.getPaymentAmount()
                            ))
                            .userId(accountId)
                            .build());

            {
                int orderId = order.getOrderId();
                CompletableFuture.runAsync(() -> {
                    try {
                        MimeMessage message = mailSender.createMimeMessage();
                        MimeMessageHelper helper = new MimeMessageHelper(message, false);
                        helper.setFrom(systemEmail);
                        helper.setTo(account.getEmail());
                        helper.setSubject("[Biddify] Invoice for order #%d".formatted(orderId));
                        helper.setText("""
<style>
  body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
  }

  .container {
    max-width: 600px;
    margin: 20px auto;
    background-color: #ffffff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    border-radius: 8px;
  }

  .header {
    background-color: #4CAF50;
    color: white;
    text-align: center;
    padding: 10px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  .invoice-details {
    margin-top: 20px;
  }

  .invoice-details p {
    margin: 5px 0;
  }

  .invoice-details table {
    width: 100%;
    border-collapse: collapse;
    border-style: hidden;
    margin: 20px 0;
  }

  .invoice-details table td,
  .invoice-details table th {
    border: 1px solid black;
    padding-left: 10px;
  }

  .invoice-details table td:nth-child(1),
  .invoice-details table th:nth-child(1) {
    width: 20%;
  }

  .footer {
    margin-top: 20px;
    font-size: 0.8em;
    color: #666;
    border-top: 1px solid #666;
  }

</style>
<div class="container">
  <div class="header">
    <h2>Invoice of order</h2>
  </div>
  <div class="invoice-details">
    <p><strong>Order ID:</strong> #123456</p>
    <p><strong>Due Date:</strong> July 15, 2024</p>
    <p><strong>Payment Amount:</strong> $200.00</p>
    <p><strong>Bill of items:</strong></p>
    <table>
      <tr>
        <th>Item ID</th>
        <th>Item Name</th>
        <th>Worth</th>
      </tr>
      <tr>
        <td>1</td>
        <td>Dummy</td>
        <td>$10</td>
      </tr>
      <tr>
        <td>2</td>
        <td>Dummy</td>
        <td>$30</td>
      </tr>
      <tr>
        <td></td>
        <td>Fee (4.5%)</td>
        <td>$1.24</td>
      </tr>
      <tr>
        <td></td>
        <td><b>Total</b></td>
        <td>$31.24</td>
      </tr>
    </table>
    <p>If you have any questions, feel free to contact our support for assistance.</p>
  </div>
  <div class="footer">
    <p>This is an auto-generated email. Please do not reply.</p>
  </div>
</div>

                                """, true);
                        mailSender.send(message);
                    } catch (MessagingException e) {
                        log.info("Error sending mail to " + account.getEmail(), e);
                    }
                });
            }

            return new OrderDTO(order);
        } catch (Exception e) {
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
