package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.BlogPostDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BlogService {
    Page<BlogPostDTO> getAllBlogs(Pageable pageable);
    BlogPostDTO getBlogById(int id);
    BlogPostDTO createBlog(BlogPostDTO BlogPostDTO);
    BlogPostDTO updateBlog(BlogPostDTO BlogPostDTO);
    void deleteBlog(int id);
    Page<BlogPostDTO> searchBlog(String keyword, Pageable pageable);
    Page<BlogPostDTO> getBlogByCategory(int categoryId, Pageable pageable);
}
