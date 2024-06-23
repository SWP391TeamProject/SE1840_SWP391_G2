package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.Item;
import fpt.edu.vn.Backend.pojo.ItemCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface ItemRepos extends JpaRepository<Item, Integer> {
    Page<Item> findItemByItemCategoryItemCategoryId(int itemCategoryId, Pageable pageable);
    Page<Item> findItemByStatus(Item.Status status, Pageable pageable);
    Page<Item> findItemByOwnerAccountId(int ownerId, Pageable pageable);
    Page<Item> findItemByNameContaining(String name, Pageable pageable);
    Page<Item> findItemByReservePriceBetween(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);


    Page<Item> findItemByReservePriceBetweenAndItemCategory_ItemCategoryId(BigDecimal reservePrice, BigDecimal reservePrice2, int itemCategory_itemCategoryId, Pageable pageable);
}
