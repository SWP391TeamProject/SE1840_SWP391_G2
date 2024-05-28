package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BlogPostRepos extends JpaRepository<BlogPost, Integer> {
    Optional<BlogPost> findByPostId(int postId);
}
