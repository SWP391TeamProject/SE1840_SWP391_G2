package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.ItemCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

@Repository
@RepositoryRestResource(collectionResourceRel = "item-categories", path = "item-categories")
public interface ItemCategoryRepos extends JpaRepository<ItemCategory, Integer> {

}
