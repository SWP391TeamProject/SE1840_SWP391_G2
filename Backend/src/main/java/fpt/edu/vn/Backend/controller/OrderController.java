package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.OrderDTO;
import fpt.edu.vn.Backend.DTO.request.OrderPayRequestDTO;
import fpt.edu.vn.Backend.DTO.request.OrderUpdateDTO;
import fpt.edu.vn.Backend.DTO.request.UpdateOrderStatusRequestDTO;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.Payment;
import fpt.edu.vn.Backend.security.Authorizer;
import fpt.edu.vn.Backend.security.JwtUser;
import fpt.edu.vn.Backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin("*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<Page<OrderDTO>> getAllOrders(@PageableDefault(size = 50, sort = "payment.paymentAmount") Pageable pageable,
                                                       @RequestParam(required = false) String order,
                                                       @RequestParam(required = false) String status) {
        if (order != null) {
            if (order.equals("desc")) {
                pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort().descending());
            }
        }
        if (status != null) {
            Payment.Status filter = Payment.Status.valueOf(status.toUpperCase());
            return ResponseEntity.ok(orderService.getAllOrdersByStatus(filter, pageable));
        }
        return ResponseEntity.ok(orderService.getAllOrders(pageable));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<OrderDTO>> getAllOrdersByUserId(Principal principal,
                                                               @PageableDefault(size = 50, sort = "createDate") Pageable pageable,
                                                               @RequestParam(required = false) String order,
                                                               @RequestParam(required = false) String status,
                                                               @PathVariable("userId") int userId) {
        Authorizer.expectManagerOrUserId(principal, userId);
        if (order != null) {
            if (order.equals("desc")) {
                pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort().descending());
            }
        }
        if (status != null) {
            Payment.Status filter = Payment.Status.valueOf(status.toUpperCase());
            return ResponseEntity.ok(orderService.getAllOrdersByUserIdAndStatus(userId, filter, pageable));
        }
        return ResponseEntity.ok(orderService.getAllOrdersByUserId(userId, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(Principal principal, @PathVariable int id) {
        OrderDTO orderDTO = orderService.getOrderById(id);
        Authorizer.expectManagerOrUserId(principal, orderDTO.getPayment().getAccountId());
        return ResponseEntity.ok(orderDTO);
    }

    @PostMapping("/{id}")
    public ResponseEntity<OrderDTO> updateOrder(Principal principal, @PathVariable int id, @RequestBody OrderUpdateDTO dto) {
        OrderDTO orderDTO = orderService.getOrderById(id);
        JwtUser user = Authorizer.expectManagerOrUserId(principal, orderDTO.getPayment().getAccountId());
        if (!Authorizer.MANAGER.contains(user.getRole())) {
            dto.setShippingStatus(null); // user cannot change shipping status
        }
        return ResponseEntity.ok(orderService.updateOrder(id, dto));
    }

    @PostMapping("/pay/{id}")
    public ResponseEntity<OrderDTO> payOrder(Principal principal, @PathVariable int id,
                                             @RequestBody OrderPayRequestDTO dto) {
        JwtUser user = Authorizer.getUser(principal);
        return ResponseEntity.ok(orderService.payOrder(user.getUserId(), id, dto));
    }
}
