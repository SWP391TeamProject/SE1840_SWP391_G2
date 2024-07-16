package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.BlogCategoryDTO;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.BlogCategory;
import fpt.edu.vn.Backend.repository.BlogCategoryRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@CacheConfig(cacheNames = "blogCategory")
public class BlogCategoryServiceImpl implements BlogCategoryService{

    private final BlogCategoryRepos blogCategoryRepos;

    @Autowired
    public BlogCategoryServiceImpl(BlogCategoryRepos blogCategoryRepository) {
        this.blogCategoryRepos = blogCategoryRepository;
    }

    @Override
    @Cacheable(key = "#pageable", value = "blogCategory")
    public Page<BlogCategoryDTO> getAllBlogCategories(Pageable pageable) {
        Page<BlogCategory> blogCategories = blogCategoryRepos.findAll(pageable);
        if (blogCategories.isEmpty()) {
            throw new ResourceNotFoundException("No blog categories found");
        }
        return blogCategories.map(BlogCategoryDTO::new);
    }

    @Override
    @Cacheable(key = "#id", value = "blogCategory")
    public BlogCategoryDTO getBlogCategoryById(int id) {
        return new BlogCategoryDTO(blogCategoryRepos.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Invalid blog category id: " + id)
        ));
    }

    @Override
    @CacheEvict(value = "blogCategory", allEntries = true)
    public BlogCategoryDTO createBlogCategory(String name) {
        BlogCategory blogCategory = new BlogCategory();
        blogCategory.setName(name);
        blogCategory.setCreateDate(java.time.LocalDateTime.now());
        blogCategory.setUpdateDate(java.time.LocalDateTime.now());
        return new BlogCategoryDTO(blogCategoryRepos.save(blogCategory));
    }

    @Override
    @Cacheable(key = "#name", value = "blogCategory")
    public BlogCategoryDTO getBlogCategoryByName(String name) {
        BlogCategory blogCategory = blogCategoryRepos.findBlogCategoryByName(name);
        if(blogCategory != null) {
            return new BlogCategoryDTO(blogCategory);
        }
        return null;
    }

    @Override
    @CacheEvict(value = "blogCategory", allEntries = true)
    public BlogCategoryDTO updateBlogCategory(int id, BlogCategory blogCategory) {
        if (!blogCategoryRepos.existsById(id)) {
            throw new ResourceNotFoundException("Invalid blog category id: " + id);
        }
        blogCategory.setBlogCategoryId(id);
        return new BlogCategoryDTO(blogCategoryRepos.save(blogCategory));
    }

    @Override
    @CacheEvict(value = "blogCategory", allEntries = true)

    public void deleteBlogCategory(int id) {
        blogCategoryRepos.deleteById(id);
    }
}
