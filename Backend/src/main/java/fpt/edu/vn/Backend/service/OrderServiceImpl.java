package fpt.edu.vn.Backend.service;

import com.google.common.base.Preconditions;
import fpt.edu.vn.Backend.DTO.NotificationDTO;
import fpt.edu.vn.Backend.DTO.OrderDTO;
import fpt.edu.vn.Backend.DTO.request.OrderPayRequestDTO;
import fpt.edu.vn.Backend.DTO.request.OrderUpdateDTO;
import fpt.edu.vn.Backend.DTO.request.UpdateOrderStatusRequestDTO;
import fpt.edu.vn.Backend.exception.ConsignmentServiceException;
import fpt.edu.vn.Backend.exception.InvalidInputException;
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
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderServiceImpl.class);
    private final OrderRepos orderRepository;
    private final PaymentRepos paymentRepository;
    private final AccountRepos accountRepos;
    private final AuctionItemRepos auctionItemRepos;
    private final ItemRepos itemRepos;
    private final NotificationService notificationService;
    private final JavaMailSender mailSender;
    @Value("${app.email}")
    private String systemEmail;

    @Autowired
    public OrderServiceImpl(OrderRepos orderRepository, PaymentRepos paymentRepository,
                            AccountRepos accountRepos, AuctionItemRepos auctionItemRepos,
                            ItemRepos itemRepos,
                            NotificationService notificationService, JavaMailSender mailSender) {
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.accountRepos = accountRepos;
        this.auctionItemRepos = auctionItemRepos;
        this.itemRepos = itemRepos;
        this.notificationService = notificationService;
        this.mailSender = mailSender;
    }

    @Override
    @Transactional
    public OrderDTO createOrder(int accountId, Set<AuctionItemId> itemIds, int auctionId) {
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

        if (!account.isDummy()){ // skip email for dummy accounts
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
    }


    @Override
    public OrderDTO getOrderById(int orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new InvalidInputException("Order not found"));
        return new OrderDTO(order);
    }

    @Override
    @Transactional
    public OrderDTO payOrder(int accountId, int orderId, OrderPayRequestDTO dto) {
        Account account = accountRepos.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found", "accountId", accountId));
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found", "orderId", orderId));
        Payment orderPayment = order.getPayment();

        // handle order for buyer
        {
            Preconditions.checkState(accountId == orderPayment.getAccount().getAccountId(),
                    "You are not authorized to pay this order");
            Preconditions.checkState(orderPayment.getStatus() == Payment.Status.PENDING,
                    "Order is not in PENDING status");
            Preconditions.checkState(account.getBalance().compareTo(orderPayment.getPaymentAmount()) >= 0,
                    "Insufficient balance");
            orderPayment.setStatus(Payment.Status.SUCCESS);
            paymentRepository.save(orderPayment);
            account.setBalance(account.getBalance().subtract(orderPayment.getPaymentAmount()));
            accountRepos.save(account);
            order.setShippingStatus(Order.ShippingStatus.PACKAGING);
            order.setShippingAddress(dto.getShippingAddress());
            order.setShippingNote(dto.getShippingNote());
            orderRepository.save(order);
            notificationService.sendNotification(
                    NotificationDTO.builder()
                            .message(String.format(
                                    "You have paid order #%d successfully. It will be packaged for delivery soon!",
                                    order.getOrderId()
                            ))
                            .userId(orderPayment.getAccount().getAccountId())
                            .build());
            log.info("Account {} paid {} for order {}", accountId, orderPayment.getPaymentAmount(), orderId);
        }

        // handle order for seller
        BigDecimal sumSoldPrice = new BigDecimal(0);
        {
            for (Item item : order.getItems()) {
                BigDecimal price = item.getSoldPrice();
                sumSoldPrice = sumSoldPrice.add(price);
                Account seller = item.getOwner();
                seller.setBalance(seller.getBalance().add(price));
                accountRepos.save(seller);
                Payment rewardPayment = Payment.builder()
                        .paymentAmount(price)
                        .account(seller)
                        .type(Payment.Type.CONSIGNMENT_REWARD)
                        .status(Payment.Status.SUCCESS)
                        .method(Payment.Method.MANUAL)
                        .build();
                paymentRepository.save(rewardPayment);
                notificationService.sendNotification(
                        NotificationDTO.builder()
                                .message(String.format(
                                        "You have received the revenue from selling item %s!",
                                        item.getName()
                                ))
                                .userId(seller.getAccountId())
                                .build());
                log.info("Account {} gained {} from selling item {} in order {}",
                        seller.getAccountId(), price, item.getItemId(), orderId);
            }
        }

        log.info("System fee = {}", orderPayment.getPaymentAmount().subtract(sumSoldPrice));

        return new OrderDTO(order);
    }

    @Override
    public void cancelOrder(Order order) {
        Payment payment = order.getPayment();
        Preconditions.checkState(payment.getStatus() == Payment.Status.PENDING,
                "Order is not in PENDING status");
        payment.setStatus(Payment.Status.FAILED);
        paymentRepository.save(payment);
        for (Item item : order.getItems()) {
            item.setOrder(null);
            item.setStatus(Item.Status.UNSOLD);
        }
        itemRepos.saveAll(order.getItems());
        log.info("Released items {} due to order cancellation", order.getItems().stream()
                .map(Item::getItemId)
                .map(String::valueOf)
                .collect(Collectors.joining(",")));
        notificationService.sendNotification(
                NotificationDTO.builder()
                        .message(String.format(
                                "Your order #%d was cancelled due to not paying within the deadline.",
                                order.getOrderId()
                        ))
                        .userId(payment.getAccount().getAccountId())
                        .build());
    }

    @Override
    public Page<OrderDTO> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable).map(OrderDTO::new);
    }

    @Override
    public Page<OrderDTO> getAllOrdersByUserId(int userId, Pageable pageable) {
        return orderRepository.findAllByPayment_Account_AccountId(userId, pageable).map(OrderDTO::new);
    }

    @Override
    public Page<OrderDTO> getAllOrdersByStatus(Payment.Status status, Pageable pageable) {
        return orderRepository.findAllByPayment_Status(status, pageable).map(OrderDTO::new);
    }

    @Override
    public Page<OrderDTO> getAllOrdersByUserIdAndStatus(int userId, Payment.Status status, Pageable pageable) {
        return orderRepository.findAllByPayment_Account_AccountIdAndPayment_Status(userId, status, pageable)
                .map(OrderDTO::new);
    }



    @Override
    public OrderDTO updateOrder(int id, OrderUpdateDTO dto) {
        final Map<Order.ShippingStatus, Set<Order.ShippingStatus>> statusMatrix = Map.of(
                Order.ShippingStatus.PACKAGING, Set.of(
                        Order.ShippingStatus.PACKAGING,
                        Order.ShippingStatus.DELIVERING
                ),
                Order.ShippingStatus.DELIVERING, Set.of(
                        Order.ShippingStatus.DELIVERING,
                        Order.ShippingStatus.DELIVERED
                ),
                Order.ShippingStatus.DELIVERED, Set.of(Order.ShippingStatus.DELIVERED)
        );
        Order order = orderRepository.findById(id).orElseThrow(() -> new InvalidInputException("Order not found"));
        Preconditions.checkState(order.getPayment().getStatus() == Payment.Status.SUCCESS,
                "Order has not paid yet");

        if (dto.getShippingStatus() != null) {
            Order.ShippingStatus currStatus = order.getShippingStatus();
            Preconditions.checkState(statusMatrix.get(currStatus).contains(dto.getShippingStatus()),
                    "Invalid new shipping status");
            order.setShippingStatus(dto.getShippingStatus());
        }

        if (dto.getShippingAddress() != null) {
            Preconditions.checkState(
                    order.getShippingStatus() == Order.ShippingStatus.PACKAGING,
                    "Cannot change shipping address now");
            order.setShippingAddress(dto.getShippingAddress());
        }

        if (dto.getShippingNote() != null) {
            Preconditions.checkState(
                    order.getShippingStatus() == Order.ShippingStatus.PACKAGING,
                    "Cannot change shipping note now");
            order.setShippingNote(dto.getShippingNote());
        }

        return new OrderDTO(orderRepository.save(order));
    }

    @Scheduled(timeUnit = TimeUnit.HOURS, fixedRate = 1, initialDelay = 0)
    @Transactional
    public void scheduleFixedRateTask() {
        LocalDateTime deadline = LocalDateTime.now().minusDays(7);
        for (Order order : orderRepository.findAllPendingOrdersWithPaymentCreatedBefore(deadline)) {
            log.info("Cancelling order {}", order.getOrderId());
            cancelOrder(order);
        }
    }
}
