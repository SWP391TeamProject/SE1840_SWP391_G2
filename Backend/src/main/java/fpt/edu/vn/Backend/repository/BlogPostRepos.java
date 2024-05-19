package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlogPostRepos extends JpaRepository<BlogPost, Integer> {
}
