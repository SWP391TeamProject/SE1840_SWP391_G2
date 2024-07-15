package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.BlogCreateDTO;
import fpt.edu.vn.Backend.DTO.BlogPostDTO;
import fpt.edu.vn.Backend.DTO.BlogUpdateDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BlogService {
    Page<BlogPostDTO> getAllBlogs(Pageable pageable);
    BlogPostDTO getBlogById(int id);
    BlogPostDTO createBlog(BlogCreateDTO BlogPostDTO);
    BlogPostDTO updateBlog(BlogUpdateDTO BlogPostDTO);
    void deleteBlog(int id);
    Page<BlogPostDTO> searchBlog(String keyword, Pageable pageable);
    Page<BlogPostDTO> getBlogByCategory(int categoryId, Pageable pageable);
    BlogPostDTO deleteAttachment(int postId, int attachmentId);
}
