package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.DTO.AuctionSessionDTO;
import fpt.edu.vn.Backend.DTO.PaymentDTO;
import fpt.edu.vn.Backend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@PreAuthorize("hasAuthority('ADMIN')")
@RestController("/api/statistics")
public class StatisticController {
    @Autowired
    private PaymentService paymentService;
    @GetMapping("/payments")
    public ResponseEntity<PaymentDTO> getTotalRevenueByDateRange(@RequestParam("startDate") String startDate, @RequestParam("endDate") String endDate, @RequestParam("type") String type) {
        // implementation here
        return null;
    }

    @GetMapping("/users/monthly/new")
    public ResponseEntity<List<AccountDTO>> getNewUsersByMonth(@RequestParam("year") int year) {
        // implementation here
        return null;
    }

    @GetMapping("/users/online")
    public ResponseEntity<List<AccountDTO>> getOnlineUsers() {
        // implementation here
        return null;
    }

    // Get total revenue by auction
    @GetMapping("/auctions/revenue")
    public ResponseEntity<List<AuctionSessionDTO>> getTotalRevenueByPastAuctions() {
        // implementation here
        return null;
    }

    @GetMapping
    public ResponseEntity<List<PaymentDTO>> getPaymentsByDateRange(@RequestParam("startDate") String startDate, @RequestParam("endDate") String endDate) {
        // implementation here
        return null;
    }










}
