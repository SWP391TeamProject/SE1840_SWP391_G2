package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.Transactions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionsRepos extends JpaRepository<Transactions, Integer> {
}
