package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.ItemCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemCategoryRepos extends JpaRepository<ItemCategory, Integer> {
}
