package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepos extends JpaRepository<Order, Integer>{
}
