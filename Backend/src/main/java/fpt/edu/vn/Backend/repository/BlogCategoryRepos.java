package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.BlogCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlogCategoryRepos extends JpaRepository<BlogCategory, Integer> {
    BlogCategory findBlogCategoryByName(String name);
}
