package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.Item;
import fpt.edu.vn.Backend.pojo.Order;
import fpt.edu.vn.Backend.pojo.OrderDetail;
import fpt.edu.vn.Backend.pojo.OrderDetailKey;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderDetailRepos extends JpaRepository<OrderDetail, OrderDetailKey> {
    List<OrderDetail> findByOrder(Order order);

    List<OrderDetail> findByItem(Item item);

    OrderDetail findByOrderAndItem(Order order, Item item);
}
