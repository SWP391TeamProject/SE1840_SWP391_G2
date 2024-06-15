package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.BlogCategoryDTO;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.BlogCategory;
import fpt.edu.vn.Backend.repository.BlogCategoryRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BlogCategoryServiceImpl implements BlogCategoryService{

    private final BlogCategoryRepos blogCategoryRepos;

    @Autowired
    public BlogCategoryServiceImpl(BlogCategoryRepos blogCategoryRepository) {
        this.blogCategoryRepos = blogCategoryRepository;
    }

    @Override
    public Page<BlogCategoryDTO> getAllBlogCategories(Pageable pageable) {
        Page<BlogCategory> blogCategories = blogCategoryRepos.findAll(pageable);
        if (blogCategories.isEmpty()) {
            throw new ResourceNotFoundException("No blog categories found");
        }
        return blogCategories.map(BlogCategoryDTO::new);
    }

    @Override
    public BlogCategoryDTO getBlogCategoryById(int id) {
        return new BlogCategoryDTO(blogCategoryRepos.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Invalid blog category id: " + id)
        ));
    }

    @Override
    public BlogCategoryDTO createBlogCategory(BlogCategory blogCategory) {
        return new BlogCategoryDTO(blogCategoryRepos.save(blogCategory));
    }

    @Override
    public BlogCategoryDTO updateBlogCategory(int id, BlogCategory blogCategory) {
        if (!blogCategoryRepos.existsById(id)) {
            throw new ResourceNotFoundException("Invalid blog category id: " + id);
        }
        blogCategory.setBlogCategoryId(id);
        return new BlogCategoryDTO(blogCategoryRepos.save(blogCategory));
    }

    @Override
    public void deleteBlogCategory(int id) {
        blogCategoryRepos.deleteById(id);
    }
}
