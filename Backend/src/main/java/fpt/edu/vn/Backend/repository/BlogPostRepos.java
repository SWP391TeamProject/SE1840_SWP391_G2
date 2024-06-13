package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.BlogPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BlogPostRepos extends JpaRepository<BlogPost, Integer> {
    Optional<BlogPost> findByPostId(int postId);
    Page<BlogPost> findAllByContentIsContainingIgnoreCase(String keyword, Pageable pageable);
    Page<BlogPost> findAllByCategoryBlogCategoryId(int id, Pageable pageable);
}
