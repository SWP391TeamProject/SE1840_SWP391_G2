package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepos extends JpaRepository<Payment, Integer>{
}
