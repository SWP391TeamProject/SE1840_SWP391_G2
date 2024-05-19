package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionsRepos extends JpaRepository<Transaction, Integer> {
}
