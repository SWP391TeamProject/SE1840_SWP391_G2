package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.BlogCategoryDTO;
import fpt.edu.vn.Backend.pojo.BlogCategory;
import fpt.edu.vn.Backend.service.BlogCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blog-categories")
public class BlogCategoryController {

    private final BlogCategoryService blogCategoryService;

    @Autowired
    public BlogCategoryController(BlogCategoryService blogCategoryService) {
        this.blogCategoryService = blogCategoryService;
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
    public ResponseEntity<BlogCategoryDTO> createBlogCategory(@RequestBody BlogCategory blogCategory) {
        return new ResponseEntity<>(blogCategoryService.createBlogCategory(blogCategory), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BlogCategoryDTO> updateBlogCategory(@PathVariable int id, @RequestBody BlogCategory blogCategory) {
        return new ResponseEntity<>(blogCategoryService.updateBlogCategory(id, blogCategory), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBlogCategory(@PathVariable int id) {
        blogCategoryService.deleteBlogCategory(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}