package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.Item;
import fpt.edu.vn.Backend.pojo.ItemCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface ItemRepos extends JpaRepository<Item, Integer> {
    List<Item> findItemByItemCategory(ItemCategory itemCategory);
}
