package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.*;

import java.util.List;

public interface StatisticService {
    List<RevenueDTO> getTotalRevenueByDateRange(String startDate, String endDate, String type);

    List<MonthlyUserDTO> getNewUsersByMonth(int year);

    long getOnlineUserCount();

    List<AuctionSessionDTO> getTotalRevenueByPastAuction(int auctionId);

    List<PaymentsByDateDTO> getPaymentsByDateRange(String startDate, String endDate);

}

