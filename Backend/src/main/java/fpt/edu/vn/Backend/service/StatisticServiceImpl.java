package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.*;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.Payment;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.PaymentRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
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
    private SessionRegistry sessionRegistry;

    @Override
    public List<RevenueDTO> getTotalRevenueByDateRange(String startDate, String endDate, String type) {
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
    public List<MonthlyUserDTO> getNewUsersByMonth(int year) {
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

    @Override
    public long getOnlineUserCount() {
        return sessionRegistry.getAllPrincipals().stream()
                .flatMap(principal -> sessionRegistry.getAllSessions(principal, false).stream())
                .map(SessionInformation::getPrincipal)
                .distinct() // To ensure each user is counted only once
                .count();
    }


    @Override
    public List<AuctionSessionDTO> getTotalRevenueByPastAuction(int auctionId) {

        return null;
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
}
