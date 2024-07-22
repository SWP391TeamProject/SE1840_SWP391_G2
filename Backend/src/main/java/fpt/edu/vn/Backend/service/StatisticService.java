package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.*;

import java.math.BigDecimal;
import java.util.List;

public interface StatisticService {
    List<RevenueDTO> getPaymentByStatus(int year, String type);

    List<MonthlyUserDTO> getNewUsersByYear(int year);

    long getOnlineUserCount();
    long getThisMonthNewUser();
    long getTotalOrders();
    long getTotalItemSold();
    long getTotalAuctionProgressing();
    BigDecimal getTotalSale();
    List<RevenueDTO> getTotalRevenueByPastAuction(int year);

    List<PaymentsByDateDTO> getPaymentsByDateRange(String startDate, String endDate);
}