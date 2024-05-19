package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemRepos extends JpaRepository<Item, Integer> {
}
