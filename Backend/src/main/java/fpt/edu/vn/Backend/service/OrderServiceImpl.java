package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.OrderDTO;
import fpt.edu.vn.Backend.DTO.request.OrderRequest;
import fpt.edu.vn.Backend.pojo.Item;
import fpt.edu.vn.Backend.pojo.Order;
import fpt.edu.vn.Backend.repository.ItemRepos;
import fpt.edu.vn.Backend.repository.OrderRepos;
import fpt.edu.vn.Backend.repository.PaymentRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService{

    private final OrderRepos orderRepository;
    private final ItemRepos itemRepository;
    private final PaymentRepos paymentRepository;

    @Autowired
    public OrderServiceImpl(OrderRepos orderRepository, ItemRepos itemRepository, PaymentRepos paymentRepository) {
        this.orderRepository = orderRepository;
        this.itemRepository = itemRepository;
        this.paymentRepository = paymentRepository;
    }


    @Override
    public OrderDTO createOrder(OrderRequest orderRequest) {
        try {
            Order order = new Order();
            Set<Item> items = new HashSet<>();
            for (int itemId : orderRequest.getItemId()) {
                items.add(itemRepository.findById(itemId).orElseThrow(() -> new RuntimeException("Item not found")));
            }
            order.setItems(items);
            order.setPayment(paymentRepository.findById(orderRequest.getPaymentId()).orElseThrow(() -> new RuntimeException("Payment not found")));
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
