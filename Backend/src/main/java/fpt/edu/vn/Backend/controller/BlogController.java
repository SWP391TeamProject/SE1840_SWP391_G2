package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.AttachmentDTO;
import fpt.edu.vn.Backend.DTO.BlogCreateDTO;
import fpt.edu.vn.Backend.DTO.BlogPostDTO;
import fpt.edu.vn.Backend.DTO.BlogUpdateDTO;
import fpt.edu.vn.Backend.service.AccountService;
import fpt.edu.vn.Backend.service.AttachmentService;
import fpt.edu.vn.Backend.service.BlogCategoryService;
import fpt.edu.vn.Backend.service.BlogService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/blogs")
public class BlogController {
    private static final Logger log = LoggerFactory.getLogger(BlogController.class);
    @Autowired
    private BlogService blogService;
    @Autowired
    private AttachmentService attachmentService;
    @Autowired
    private AccountService accountService;
    @Autowired
    private BlogCategoryService blogCategoryService;

    @GetMapping("/")
    public ResponseEntity<Page<BlogPostDTO>> getAllBlogs(@PageableDefault Pageable pageable) {
        return new ResponseEntity<>(blogService.getAllBlogs(pageable), HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<BlogPostDTO>> searchBlog(@RequestParam String keyword, @PageableDefault(size = 50) Pageable pageable) {
        return new ResponseEntity<>(blogService.searchBlog(keyword, pageable), HttpStatus.OK);
    }

    @GetMapping("/category")
    public ResponseEntity<Page<BlogPostDTO>> getBlogByCategory(@RequestParam int categoryId, @PageableDefault(size = 50) Pageable pageable) {
        return new ResponseEntity<>(blogService.getBlogByCategory(categoryId, pageable), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlogPostDTO> getBlogById(@PathVariable int id) {
        return new ResponseEntity<>(blogService.getBlogById(id), HttpStatus.OK);
    }

    @PostMapping("/")
    public ResponseEntity<BlogPostDTO> createBlog(@ModelAttribute BlogCreateDTO blogCreateDTO) {
        return new ResponseEntity<>(blogService.createBlog(blogCreateDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BlogPostDTO> updateBlog(@PathVariable int id, @ModelAttribute BlogUpdateDTO blogUpdateDTO) {
        BlogPostDTO blogPostDTO = blogService.getBlogById(id);
        if(blogPostDTO == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if(blogPostDTO.getAuthor().getAccountId() != blogUpdateDTO.getUserId()) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        blogUpdateDTO.setPostId(blogPostDTO.getPostId());
        blogPostDTO = blogService.updateBlog(blogUpdateDTO);
        return new ResponseEntity<>(blogPostDTO, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBlog(@PathVariable int id) {
        blogService.deleteBlog(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }


}
