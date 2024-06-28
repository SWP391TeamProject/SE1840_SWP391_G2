package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.BlogCategoryDTO;
import fpt.edu.vn.Backend.pojo.BlogCategory;
import fpt.edu.vn.Backend.service.BlogCategoryService;
import fpt.edu.vn.Backend.service.BlogServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/blog-categories")
public class BlogCategoryController {

    private static final Logger log = LoggerFactory.getLogger(BlogCategoryController.class);
    private final BlogCategoryService blogCategoryService;
    private final BlogServiceImpl blogServiceImpl;

    @Autowired
    public BlogCategoryController(BlogCategoryService blogCategoryService, BlogServiceImpl blogServiceImpl) {
        this.blogCategoryService = blogCategoryService;
        this.blogServiceImpl = blogServiceImpl;
    }

    @GetMapping("/")
    public ResponseEntity<Page<BlogCategoryDTO>> getAllBlogCategories(@PageableDefault(size = 200) Pageable pageable) {
        return new ResponseEntity<>(blogCategoryService.getAllBlogCategories(pageable), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlogCategoryDTO> getBlogCategoryById(@PathVariable int id) {
        return new ResponseEntity<>(blogCategoryService.getBlogCategoryById(id), HttpStatus.OK);
    }

    @PostMapping("/")
    public ResponseEntity<BlogCategoryDTO> createBlogCategory(@RequestBody BlogCategoryDTO blogCategory) {
        if(blogCategory.getName() == null || blogCategory.getName().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if(blogCategoryService.getBlogCategoryByName(blogCategory.getName()) != null) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
        log.info("Create blog category with name: {}", blogCategory.getName());
        return new ResponseEntity<>(blogCategoryService.createBlogCategory(blogCategory.getName()), HttpStatus.CREATED);
    }


    @PostMapping("delete/{id}")
    public ResponseEntity<Void> deleteBlogCategory(@PathVariable int id) {
        Pageable pageable = Pageable.unpaged();
        if(blogCategoryService.getBlogCategoryById(id) == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if(!blogServiceImpl.getBlogByCategory(id, pageable).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
        blogCategoryService.deleteBlogCategory(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}