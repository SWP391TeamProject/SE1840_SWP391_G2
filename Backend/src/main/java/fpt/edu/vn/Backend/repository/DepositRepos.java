package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.Deposit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepositRepos extends JpaRepository<Deposit,Integer> {
}
