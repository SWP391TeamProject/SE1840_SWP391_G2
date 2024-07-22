package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.*;
import fpt.edu.vn.Backend.oauth2.security.UserActivityService;
import fpt.edu.vn.Backend.service.PaymentService;
import fpt.edu.vn.Backend.service.StatisticService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

//@PreAuthorize("hasAuthority('ADMIN')")
@RestController
@RequestMapping("/api/statistics")
public class StatisticController {
    @Autowired
    private StatisticService statisticService;

    @Autowired
    private UserActivityService userActivityService;

//    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("payments/filter-by-status")
    public ResponseEntity<List<RevenueDTO>> getPaymentByStatus(@RequestParam("startDate") String startDate, @RequestParam("endDate") String endDate, @RequestParam("type") String type) {
        return new ResponseEntity<>(statisticService.getPaymentByStatus(startDate,endDate,type), HttpStatus.OK);
    }

//    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users/filter-by-year")
    public ResponseEntity<List<MonthlyUserDTO>> getNewUsersByYear(@RequestParam("year") int year) {
        return new ResponseEntity<>(statisticService.getNewUsersByYear(year), HttpStatus.OK);
    }

    @GetMapping("/users/filter-by-month")
    public ResponseEntity<Long> getUserThisMonth() {
        return new ResponseEntity<>(statisticService.getThisMonthNewUser(), HttpStatus.OK);
    }

    @GetMapping("/totals/order")
    public ResponseEntity<Long> getTotalOrder() {
        return new ResponseEntity<>(statisticService.getTotalOrders(), HttpStatus.OK);
    }
    @GetMapping("/totals/item_sold")
    public ResponseEntity<Long> getTotalItemSold() {
        return new ResponseEntity<>(statisticService.getTotalItemSold(), HttpStatus.OK);
    }

//    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users/online")
    public ResponseEntity<Long> getOnlineUsers() {
        return new ResponseEntity<>(statisticService.getOnlineUserCount(),HttpStatus.OK);
    }

//    @PreAuthorize("hasRole('ADMIN')")
    // Get total revenue by auction
    @GetMapping("auctions/filter-by-year")
    public ResponseEntity<List<RevenueDTO>> getTotalRevenueByPastAuction(@RequestParam("year") int year) {

        return new ResponseEntity<>(statisticService.getTotalRevenueByPastAuction(year), HttpStatus.OK);
    }

//    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("payments/filter-by-date")
    public ResponseEntity<List<PaymentsByDateDTO>> getAllPaymentsByDateRange(@RequestParam("startDate") String startDate, @RequestParam("endDate") String endDate) {
        return new ResponseEntity<>(statisticService.getPaymentsByDateRange(startDate,endDate), HttpStatus.OK);
    }

    @GetMapping("/total/sales")
    public ResponseEntity<BigDecimal> getSoldItemsPrices() {
       return new ResponseEntity<>(statisticService.getTotalSale(), HttpStatus.OK);
    }

    @GetMapping("/user-online")
    public ResponseEntity<Map<String, Long>> getOnlineUsers(
            @RequestParam(name = "thresholdMillis", defaultValue = "60000") long thresholdMillis) {
        Map<String, Long> onlineUsers = userActivityService.getOnlineUsers(thresholdMillis);
        return ResponseEntity.ok(onlineUsers);
    }

}











