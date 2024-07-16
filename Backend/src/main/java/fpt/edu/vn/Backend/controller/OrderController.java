package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.OrderDTO;
import fpt.edu.vn.Backend.DTO.request.UpdateOrderStatusRequestDTO;
import fpt.edu.vn.Backend.pojo.Payment;
import fpt.edu.vn.Backend.security.Authorizer;
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
    @PreAuthorize("hasAuthority('ADMIN')")
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
    public ResponseEntity<Page<OrderDTO>> getAllOrdersByUserId(@PageableDefault(size = 50, sort = "createDate") Pageable pageable,
                                                               @RequestParam(required = false) String order,
                                                               @RequestParam(required = false) String status,
                                                               @PathVariable("userId") int userId) {
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
        Authorizer.expectAdminOrUserId(principal, orderDTO.getPayment().getAccountId());
        return ResponseEntity.ok(orderDTO);
    }

    @GetMapping("update/{id}")
    public ResponseEntity<OrderDTO> updateShippingAddress(@PathVariable int id,
                                                          @RequestParam String address) {
        OrderDTO orderDTO = orderService.updateOrderShippingAddress(address,id);
        return ResponseEntity.ok(orderDTO);
    }

    @PostMapping("/updateStatus")
    public ResponseEntity<Void> updateItemStatus(@RequestBody(required = false) UpdateOrderStatusRequestDTO orderDTOList) {
        orderService.updateOrderByStatus(orderDTOList);
        return ResponseEntity.ok().build();
    }
}
