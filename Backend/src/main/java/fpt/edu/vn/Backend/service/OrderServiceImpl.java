package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.OrderDTO;
import fpt.edu.vn.Backend.pojo.Order;
import fpt.edu.vn.Backend.repository.ItemRepos;
import fpt.edu.vn.Backend.repository.OrderRepos;
import fpt.edu.vn.Backend.repository.PaymentRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
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
    public OrderDTO createOrder(OrderDTO orderDTO) {
        Order order = new Order();
        order.setItem(itemRepository.findById(orderDTO.getItemId()).orElseThrow(() -> new RuntimeException("Item not found")));
        order.setPayment(paymentRepository.findById(orderDTO.getPayment().getId()).orElseThrow(() -> new RuntimeException("Payment not found")));
        order = orderRepository.save(order);
        return new OrderDTO(order);
    }

    @Override
    public OrderDTO getOrderById(int orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        return new OrderDTO(order);
    }

    @Override
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream().map(OrderDTO::new).collect(Collectors.toList());
    }

    @Override
    public OrderDTO updateOrder(int orderId, OrderDTO orderDTO) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        order.setItem(itemRepository.findById(orderDTO.getItemId()).orElseThrow(() -> new RuntimeException("Item not found")));
        order.setPayment(paymentRepository.findById(orderDTO.getPayment().getId()).orElseThrow(() -> new RuntimeException("Payment not found")));
        order = orderRepository.save(order);
        return new OrderDTO(order);
    }

    @Override
    public void deleteOrder(int orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        orderRepository.delete(order);
    }
}
