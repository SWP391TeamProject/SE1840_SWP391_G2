package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.*;
import fpt.edu.vn.Backend.service.StatisticService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/statistics")
@CrossOrigin("*")
@Slf4j
public class StatisticController {
    @Autowired
    private StatisticService statisticService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/payments/revenue")
    public ResponseEntity<List<RevenueDTO>> getTotalRevenueByDateRange(@RequestParam("startDate") String startDate, @RequestParam("endDate") String endDate, @RequestParam("type") String type) {
        return new ResponseEntity<>(statisticService.getTotalRevenueByDateRange(startDate,endDate,type), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users/monthly/new")
    public ResponseEntity<List<MonthlyUserDTO>> getNewUsersByMonth(@RequestParam("year") int year) {
        return new ResponseEntity<>(statisticService.getNewUsersByMonth(year), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users/online")
    public ResponseEntity<Long> getOnlineUsers() {
        return new ResponseEntity<>(statisticService.getOnlineUserCount(),HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    // Get total revenue by auction
    @GetMapping("/auctions/revenue")
    public ResponseEntity<List<AuctionSessionDTO>> getTotalRevenueByPastAuction(@RequestParam("auctionId") int auctionId) {
        // implementation here
        return null;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/payments")
    public ResponseEntity<List<PaymentsByDateDTO>> getPaymentsByDateRange(@RequestParam("startDate") String startDate, @RequestParam("endDate") String endDate) {
        return new ResponseEntity<>(statisticService.getPaymentsByDateRange(startDate,endDate), HttpStatus.OK);
    }

}


