package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentRepos extends JpaRepository<Payment, Integer>, JpaSpecificationExecutor<Payment> {

    @Query("SELECT p.createDate AS createDate, SUM(p.paymentAmount) AS totalAmount " +
            "FROM Payment p WHERE p.createDate BETWEEN :start AND :end AND p.type = :type " +
            "AND p.status = 'SUCCESS'" +
            "GROUP BY p.createDate ORDER BY p.createDate")
    List<Object[]> findTotalRevenueByDateRange(LocalDateTime start, LocalDateTime end, Payment.Type type);

    List<Payment> findAllByCreateDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    Page<Payment> findAllByStatus(Payment.Status status, Pageable pageable);


    Page<Payment> findAllByType(Payment.Type type, Pageable pageable);
}
