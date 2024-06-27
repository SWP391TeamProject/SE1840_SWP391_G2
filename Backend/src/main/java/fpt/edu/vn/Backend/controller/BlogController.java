package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.BlogCreateDTO;
import fpt.edu.vn.Backend.DTO.BlogPostDTO;
import fpt.edu.vn.Backend.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
        log.info("Create blog: " + blogCreateDTO);
        BlogPostDTO blogPostDTO = new BlogPostDTO();
        blogPostDTO.setTitle(blogCreateDTO.getTitle());
        blogPostDTO.setContent(blogCreateDTO.getContent());
        blogPostDTO.setAuthor(accountService.getAccountById(blogCreateDTO.getUserId()));
        blogPostDTO.setCreateDate(blogCreateDTO.getCreateDate());
        blogPostDTO.setUpdateDate(blogCreateDTO.getUpdateDate());
        blogPostDTO.setCategory(blogCategoryService.getBlogCategoryById(blogCreateDTO.getCategoryId()));
        blogPostDTO = blogService.createBlog(blogPostDTO);

        try {
            if (blogCreateDTO.getFiles() != null && !blogCreateDTO.getFiles().isEmpty()){
                for (MultipartFile image : blogCreateDTO.getFiles()) {
                    attachmentService.uploadBlogAttachment(image, blogPostDTO.getPostId());
                }
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(blogService.getBlogById(blogPostDTO.getPostId()), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BlogPostDTO> updateBlog(@PathVariable int id, @ModelAttribute BlogCreateDTO blogCreateDTO) {
        BlogPostDTO blogPostDTO = new BlogPostDTO();
        blogPostDTO.setPostId(id);
        blogPostDTO.setTitle(blogCreateDTO.getTitle());
        blogPostDTO.setContent(blogCreateDTO.getContent());
        blogPostDTO.setAuthor(accountService.getAccountById(blogCreateDTO.getUserId()));
        blogPostDTO.setCreateDate(blogCreateDTO.getCreateDate());
        blogPostDTO.setUpdateDate(blogCreateDTO.getUpdateDate());
        blogPostDTO.setCategory(blogCategoryService.getBlogCategoryById(blogCreateDTO.getCategoryId()));
        blogPostDTO = blogService.updateBlog(blogPostDTO);
        if (blogCreateDTO.getFiles() != null && !blogCreateDTO.getFiles().isEmpty()) {
            try {
                for (MultipartFile image : blogCreateDTO.getFiles()) {
                    attachmentService.uploadBlogAttachment(image, blogPostDTO.getPostId());
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
