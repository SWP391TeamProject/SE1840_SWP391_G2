package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentRepos extends JpaRepository<Payment, Integer>, JpaSpecificationExecutor<Payment> {


    @Query("SELECT FUNCTION('YEAR', p.createDate) AS year, FUNCTION('MONTH', p.createDate) AS month, SUM(p.paymentAmount) AS totalAmount " +
            "FROM Payment p WHERE FUNCTION('YEAR', p.createDate) = :year AND p.type = :type " +
            "AND p.status = 'SUCCESS' " +
            "GROUP BY FUNCTION('YEAR', p.createDate), FUNCTION('MONTH', p.createDate) " +
            "ORDER BY FUNCTION('YEAR', p.createDate), FUNCTION('MONTH', p.createDate)")
    List<Object[]> findTotalRevenueByYearAndMonth(@Param("year") int year, @Param("type") Payment.Type type);

    List<Payment> findAllByCreateDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    Page<Payment> findAllByStatus(Payment.Status status, Pageable pageable);


    Page<Payment> findAllByType(Payment.Type type, Pageable pageable);

    List<Payment> findAllByAccount_Email(String email);

    @Query("SELECT p FROM Payment p WHERE p.status = 'PENDING' AND p.type = :type AND p.createDate <= :dayAgo")
    List<Payment> findAllPendingPaymentWithPaymentCreatedBefore(LocalDateTime dayAgo, Payment.Type type);


    @Query("SELECT SUM(p.paymentAmount) FROM Payment p WHERE (:accountId IS NULL OR p.account.id = :accountId) " +
            "AND (:startDate IS NULL OR p.createDate >= :startDate) " +
            "AND (:endDate IS NULL OR p.createDate <= :endDate) " +
            "AND p.type = 'DEPOSIT' " +
            "AND p.status = 'SUCCESS'")
    BigDecimal getInboundFund(@Param("accountId") Integer accountId,
                              @Param("startDate") LocalDateTime startDate,
                              @Param("endDate") LocalDateTime endDate);

    @Query("SELECT SUM(p.paymentAmount) FROM Payment p WHERE (:accountId IS NULL OR p.account.id = :accountId) " +
            "AND (:startDate IS NULL OR p.createDate >= :startDate) " +
            "AND (:endDate IS NULL OR p.createDate <= :endDate) " +
            "AND p.type = 'WITHDRAW' " +
            "AND p.status = 'SUCCESS'")
    BigDecimal getOutgoingFund(@Param("accountId") Integer accountId,
                               @Param("startDate") LocalDateTime startDate,
                               @Param("endDate") LocalDateTime endDate);

    @Query("SELECT SUM(p.paymentAmount) FROM Payment p WHERE (:accountId IS NULL OR p.account.id = :accountId) " +
            "AND (:startDate IS NULL OR p.createDate >= :startDate) " +
            "AND (:endDate IS NULL OR p.createDate <= :endDate) " +
            "AND ((p.type = 'WITHDRAW' " +
            "AND p.status = 'PENDING') " +
            "OR (p.type = 'AUCTION_DEPOSIT' " +
            "AND p.status = 'PENDING'))")
    BigDecimal getFrozenMoney(@Param("accountId") Integer accountId,
                              @Param("startDate") LocalDateTime startDate,
                              @Param("endDate") LocalDateTime endDate);

    @Query("SELECT SUM(p.paymentAmount) FROM Payment p WHERE (:accountId IS NULL OR p.account.id = :accountId) " +
            "AND (:startDate IS NULL OR p.createDate >= :startDate) " +
            "AND (:endDate IS NULL OR p.createDate <= :endDate) " +
            "AND ((p.type = 'DEPOSIT' " +
            "AND p.status = 'SUCCESS') " +
            "OR (p.type = 'CONSIGNMENT_REWARD' " +
            "AND p.status = 'SUCCESS'))")
    BigDecimal getWalletDeposit(@Param("accountId") Integer accountId,
                                @Param("startDate") LocalDateTime startDate,
                                @Param("endDate") LocalDateTime endDate);

    @Query("SELECT SUM(p.paymentAmount) FROM Payment p WHERE (:accountId IS NULL OR p.account.id = :accountId) " +
            "AND (:startDate IS NULL OR p.createDate >= :startDate) " +
            "AND (:endDate IS NULL OR p.createDate <= :endDate) " +
            "AND p.type = 'AUCTION_ORDER' " +
            "AND p.status = 'SUCCESS'")
    BigDecimal getWalletWithdrawal(@Param("accountId") Integer accountId,
                                   @Param("startDate") LocalDateTime startDate,
                                   @Param("endDate") LocalDateTime endDate);
}
