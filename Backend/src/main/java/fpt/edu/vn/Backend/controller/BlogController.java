package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.BlogCreateDTO;
import fpt.edu.vn.Backend.DTO.BlogPostDTO;
import fpt.edu.vn.Backend.service.AttachmentServiceImpl;
import fpt.edu.vn.Backend.service.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/blogs")
public class BlogController {
    @Autowired
    private BlogService blogService;
    @Autowired
    private AttachmentServiceImpl attachmentServiceImpl;

    @GetMapping("/")
    public ResponseEntity<Page<BlogPostDTO>> getAllBlogs(@RequestParam(defaultValue = "0") int pageNumb, @RequestParam(defaultValue = "50") int pageSize) {
        Pageable pageable = PageRequest.of(pageNumb, pageSize);
        return new ResponseEntity<>(blogService.getAllBlogs(pageable), HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<BlogPostDTO>> searchBlog(@RequestParam String keyword, @RequestParam(defaultValue = "0") int pageNumb, @RequestParam(defaultValue = "50") int pageSize) {
        Pageable pageable = PageRequest.of(pageNumb, pageSize);
        return new ResponseEntity<>(blogService.searchBlog(keyword, pageable), HttpStatus.OK);
    }

    @GetMapping("/category")
    public ResponseEntity<Page<BlogPostDTO>> getBlogByCategory(@RequestParam int categoryId, @RequestParam(defaultValue = "0") int pageNumb, @RequestParam(defaultValue = "50") int pageSize) {
        Pageable pageable = PageRequest.of(pageNumb, pageSize);
        return new ResponseEntity<>(blogService.getBlogByCategory(categoryId, pageable), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlogPostDTO> getBlogById(@PathVariable int id) {
        return new ResponseEntity<>(blogService.getBlogById(id), HttpStatus.OK);
    }

    @PostMapping("/")
    public ResponseEntity<BlogPostDTO> createBlog(@RequestBody BlogCreateDTO blogCreateDTO) {
        BlogPostDTO blogPostDTO = new BlogPostDTO();
        blogPostDTO.setTitle(blogCreateDTO.getTitle());
        blogPostDTO.setContent(blogCreateDTO.getContent());
        blogPostDTO.setAuthorId(blogCreateDTO.getUserId());
        blogPostDTO.setCreateDate(blogCreateDTO.getCreateDate());
        blogPostDTO.setUpdateDate(blogCreateDTO.getUpdateDate());
        blogPostDTO.setCategoryId(blogCreateDTO.getCategoryId());
        blogPostDTO = blogService.createBlog(blogPostDTO);
        try {
            for (MultipartFile image : blogCreateDTO.getImages()) {
                attachmentServiceImpl.uploadBlogAttachment(image, blogPostDTO.getPostId());
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(blogService.getBlogById(blogPostDTO.getPostId()), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BlogPostDTO> updateBlog(@PathVariable int id, @RequestBody BlogCreateDTO blogCreateDTO) {
        BlogPostDTO blogPostDTO = new BlogPostDTO();
        blogPostDTO.setTitle(blogCreateDTO.getTitle());
        blogPostDTO.setContent(blogCreateDTO.getContent());
        blogPostDTO.setAuthorId(blogCreateDTO.getUserId());
        blogPostDTO.setCreateDate(blogCreateDTO.getCreateDate());
        blogPostDTO.setUpdateDate(blogCreateDTO.getUpdateDate());
        blogPostDTO.setCategoryId(blogCreateDTO.getCategoryId());
        blogPostDTO = blogService.createBlog(blogPostDTO);
        if (blogCreateDTO.getImages() != null && !blogCreateDTO.getImages().isEmpty()) {
            try {
                for (MultipartFile image : blogCreateDTO.getImages()) {
                    attachmentServiceImpl.uploadBlogAttachment(image, blogPostDTO.getPostId());
                }
            } catch (Exception e) {
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<>(blogService.getBlogById(blogPostDTO.getPostId()), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBlog(@PathVariable int id) {
        blogService.deleteBlog(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }


}
