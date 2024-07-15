package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.*;
import fpt.edu.vn.Backend.oauth2.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.*;
import fpt.edu.vn.Backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StatisticServiceImpl implements StatisticService {

    @Autowired
    private PaymentRepos paymentRepos;

    @Autowired
    private AccountRepos accountRepos;

    @Autowired
    private OrderRepos orderRepos;

    @Autowired
    private ItemRepos itemRepos;

    @Autowired
    private AuctionSessionRepos auctionSessionRepos;

    @Override
    public List<RevenueDTO> getPaymentByStatus(String startDate, String endDate, String type) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");
        LocalDateTime start;
        LocalDateTime end;
        try {
            start = LocalDate.parse(startDate, formatter).atStartOfDay();
            end = LocalDate.parse(endDate, formatter).atTime(23, 59, 59);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid date format. Expected format is yyyy/MM/dd.", e);
        }

        Payment.Type paymentType = Payment.Type.valueOf(type.toUpperCase());

        List<Object[]> resultList = paymentRepos.findTotalRevenueByDateRange(start, end, paymentType);

        List<RevenueDTO> revenueDTOList = new ArrayList<>();
        for (Object[] result : resultList) {
            LocalDateTime createDate = (LocalDateTime) result[0];
            BigDecimal totalAmount = (BigDecimal) result[1];

            RevenueDTO revenueDTO = new RevenueDTO(createDate, totalAmount);
            revenueDTOList.add(revenueDTO);
        }

        return revenueDTOList;
    }

    @Override
    public List<MonthlyUserDTO> getNewUsersByYear(int year) {
        List<Object[]> results = accountRepos.findNewUsersByMonth(year);
        List<MonthlyUserDTO> monthlyUserCounts = new ArrayList<>();
        if (results.isEmpty()) {
            throw new ResourceNotFoundException("No user found", "year", year);
        }
        for (Object[] result : results) {
            int month = (Integer) result[0];
            long userCount = (Long) result[1];
            monthlyUserCounts.add(new MonthlyUserDTO(month, userCount));
        }

        return monthlyUserCounts;
    }


    public long getThisMonthNewUser(){
        LocalDate currentDate = LocalDate.now();
        int currentYear = currentDate.getYear();
        int currentMonth = currentDate.getMonthValue();

        return accountRepos.findNewUsersCountForMonth(currentYear, currentMonth);
    }


    @Override
    public long getOnlineUserCount() {
        return 0;
    }

    @Override
    public List<RevenueDTO> getTotalRevenueByPastAuction(int year) {
        List<AuctionSession> finishedAuctionSessions = auctionSessionRepos.findFinishedAuctionSessionsByYear(year);
        Map<Integer, BigDecimal> monthlyRevenue = new HashMap<>();

        // Initialize all months with zero revenue
        for (int i = 1; i <= 12; i++) {
            monthlyRevenue.put(i, BigDecimal.ZERO);
        }

        // Update the map with actual revenue data
        for (AuctionSession auctionSession : finishedAuctionSessions) {

                int month = auctionSession.getEndDate().getMonthValue();
                BigDecimal totalRevenue = monthlyRevenue.getOrDefault(month, BigDecimal.ZERO);

                for (AuctionItem auctionItem : auctionSession.getAuctionItems()) {
                    totalRevenue = totalRevenue.add(auctionItem.getCurrentPrice());
                }

                monthlyRevenue.put(month, totalRevenue);

        }

        // Create the list of RevenueDTO objects
        List<RevenueDTO> revenueDTOList = new ArrayList<>();
        for (Map.Entry<Integer, BigDecimal> entry : monthlyRevenue.entrySet()) {
            int month = entry.getKey();
            BigDecimal totalAmount = entry.getValue();
            LocalDateTime date = LocalDateTime.of(year, month, 1, 0, 0); // First day of the month
            revenueDTOList.add(new RevenueDTO(date, totalAmount));
        }

        return revenueDTOList;
    }

    @Override
    public List<PaymentsByDateDTO> getPaymentsByDateRange(String startDate, String endDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");
        LocalDateTime start;
        LocalDateTime end;
        try {
            start = LocalDate.parse(startDate, formatter).atStartOfDay();
            end = LocalDate.parse(endDate, formatter).atTime(23, 59, 59);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid date format. Expected format is yyyy/MM/dd.", e);
        }

        List<Payment> payments = paymentRepos.findAllByCreateDateBetween(start, end);

        // Group payments by month and count them
        Map<YearMonth, Long> paymentsByMonth = payments.stream()
                .collect(Collectors.groupingBy(
                        payment -> YearMonth.from(payment.getCreateDate()),
                        Collectors.counting()
                ));

        return paymentsByMonth.entrySet().stream()
                .map(entry -> new PaymentsByDateDTO(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }
    @Override
    public List<OrderDTO> getOrderHistory() {
        List<Order> orders = orderRepos.findAll();

        // Convert Order entities to OrderDTO objects
        List<OrderDTO> orderDTOs = orders.stream()
                .map(this::convertToOrderDTO)
                .collect(Collectors.toList());

        return orderDTOs;
    }

    private OrderDTO convertToOrderDTO(Order order) {
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setCreateDate(order.getCreateDate());
        orderDTO.setOrderId(order.getOrderId());
        orderDTO.setPayment(new PaymentDTO(order.getPayment()));
        orderDTO.setShippingAddress(order.getShippingAddress());
        orderDTO.setAuctionItemDTOS(order.getAuctionItems().stream().map(AuctionItemDTO::new).collect(Collectors.toSet()));
        return orderDTO;
    }

    @Override
    public long getTotalOrders(){
        return orderRepos.findAll().size();
    }
    @Override
    public long getTotalItemSold(){
        List<Item> soldItems = itemRepos.findByStatus(Item.Status.SOLD);
        return soldItems.size();
    }
    @Override
    public BigDecimal getTotalSale(){
        List<Item> soldItems = itemRepos.findByStatus(Item.Status.SOLD);
        BigDecimal result = BigDecimal.ZERO;

        for (Item item : soldItems) {
            if (item.getReservePrice() != null) {
                result = result.add(item.getReservePrice());
            }
        }

        return result;
    }




}

