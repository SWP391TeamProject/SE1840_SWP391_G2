package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.Order;
import fpt.edu.vn.Backend.pojo.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepos extends JpaRepository<Order, Integer> {
    Page<Order> findAllByPayment_Account_AccountId(int accountId, Pageable pageable);

    Page<Order> findAllByPayment_Status(Payment.Status status, Pageable pageable);

    Page<Order> findAllByPayment_Account_AccountIdAndPayment_Status(int accountId, Payment.Status status, Pageable pageable);

}
