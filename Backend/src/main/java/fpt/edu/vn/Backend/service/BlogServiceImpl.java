package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.BlogPostDTO;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.BlogPost;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.BlogCategoryRepos;
import fpt.edu.vn.Backend.repository.BlogPostRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class BlogServiceImpl implements BlogService{
    @Autowired
    private BlogPostRepos blogPostRepos;
    @Autowired
    private AccountRepos accountRepos;
    @Autowired
    private BlogCategoryRepos blogCategoryRepos;

    @Override
    public Page<BlogPostDTO> getAllBlogs(Pageable pageable) {
        return blogPostRepos.findAll(pageable).map(BlogPostDTO::new);
    }

    @Override
    public BlogPostDTO getBlogById(int id) {
        return blogPostRepos.findByPostId(id).map(BlogPostDTO::new).orElseThrow(() -> new ResourceNotFoundException("Invalid blog id: " + id));
    }

    @Override
    public BlogPostDTO createBlog(BlogPostDTO BlogPostDTO) {
            BlogPost blogPost = toEntity(BlogPostDTO);
            blogPost.setCreateDate(LocalDateTime.now());
            blogPost.setUpdateDate(LocalDateTime.now());
            return new BlogPostDTO(blogPostRepos.save(blogPost));
    }
    public BlogPost toEntity(BlogPostDTO blogPostDTO) {
        BlogPost blogPost = new BlogPost();
        blogPost.setPostId(blogPostDTO.getPostId());
        blogPost.setTitle(blogPostDTO.getTitle());
        blogPost.setContent(blogPostDTO.getContent());
        blogPost.setCreateDate(blogPostDTO.getCreateDate());
        blogPost.setUpdateDate(blogPostDTO.getUpdateDate());
        blogPost.setCategory(blogCategoryRepos.findById(blogPostDTO.getCategoryId()).orElseThrow(() -> new ResourceNotFoundException("Invalid category id: " + blogPostDTO.getCategoryId())));
        blogPost.setAuthor(accountRepos.findById(blogPostDTO.getAuthorId()).orElseThrow(() -> new ResourceNotFoundException("Invalid author id: " + blogPostDTO.getAuthorId())));
        return blogPost;
    }
    @Override
    public BlogPostDTO updateBlog(BlogPostDTO BlogPostDTO) {
        return blogPostRepos.findById(BlogPostDTO.getPostId()).map(blogPost -> {
            blogPost.setTitle(BlogPostDTO.getTitle());
            blogPost.setContent(BlogPostDTO.getContent());
            blogPost.setUpdateDate(LocalDateTime.now());
            return new BlogPostDTO(blogPostRepos.save(blogPost));
        }).orElseThrow(() -> new ResourceNotFoundException("Invalid blog id: " + BlogPostDTO.getPostId()));
    }

    @Override
    public void deleteBlog(int id) {
        blogPostRepos.delete(blogPostRepos.findByPostId(id).orElseThrow(() -> new ResourceNotFoundException("Invalid blog id: " + id)));
    }

    @Override
    public Page<BlogPostDTO> searchBlog(String keyword, Pageable pageable) {
        return blogPostRepos.findAllByContentIsContainingIgnoreCase(keyword, pageable ).map(BlogPostDTO::new);
    }

    @Override
    public Page<BlogPostDTO> getBlogByCategory(int categoryId,Pageable pageable) {
        return blogPostRepos.findAllByCategoryBlogCategoryId(categoryId,pageable).map(BlogPostDTO::new);
    }
}
