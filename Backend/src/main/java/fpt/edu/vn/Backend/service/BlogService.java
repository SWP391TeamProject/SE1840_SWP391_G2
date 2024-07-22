package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.AttachmentDTO;
import fpt.edu.vn.Backend.DTO.BlogCreateDTO;
import fpt.edu.vn.Backend.DTO.BlogPostDTO;
import fpt.edu.vn.Backend.DTO.BlogUpdateDTO;
import fpt.edu.vn.Backend.DTO.request.AttachmentUploadDTO;
import org.jetbrains.annotations.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.IOException;
import java.util.List;

public interface BlogService {
    Page<BlogPostDTO> getAllBlogs(@Nullable String keyword, @Nullable Integer categoryId, Pageable pageable);
    BlogPostDTO getBlogById(int id);
    BlogPostDTO createBlog(BlogCreateDTO BlogPostDTO);
    BlogPostDTO updateBlog(BlogUpdateDTO BlogPostDTO);
    void deleteBlog(int id);
    Page<BlogPostDTO> getBlogByCategory(int categoryId, Pageable pageable);
    void deleteAttachment(int postId, int attachmentId);
    List<AttachmentDTO> uploadAttachment(int id, AttachmentUploadDTO dto) throws IOException;
}
