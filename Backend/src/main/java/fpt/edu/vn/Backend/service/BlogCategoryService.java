package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.BlogCategoryDTO;
import fpt.edu.vn.Backend.pojo.BlogCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BlogCategoryService {
    public Page<BlogCategoryDTO> getAllBlogCategories(Pageable pageable) ;
    public BlogCategoryDTO getBlogCategoryById(int id);
    public BlogCategoryDTO createBlogCategory(String name);
    public BlogCategoryDTO updateBlogCategory(int id, BlogCategory blogCategory);

    public BlogCategoryDTO getBlogCategoryByName(String name);

    public void deleteBlogCategory(int id);
}
