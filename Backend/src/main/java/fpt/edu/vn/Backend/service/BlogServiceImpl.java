package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.BlogPostDTO;
import fpt.edu.vn.Backend.DTO.NotificationDTO;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.BlogPost;
import fpt.edu.vn.Backend.pojo.Notification;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.BlogCategoryRepos;
import fpt.edu.vn.Backend.repository.BlogPostRepos;
import fpt.edu.vn.Backend.repository.NotificationRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BlogServiceImpl implements BlogService{
    @Autowired
    private BlogPostRepos blogPostRepos;
    @Autowired
    private AccountRepos accountRepos;
    @Autowired
    private BlogCategoryRepos blogCategoryRepos;

    @Autowired
    private NotificationServiceImpl notificationService;

    @Autowired
    private NotificationRepos notificationRepos;


    @Override
    public Page<BlogPostDTO> getAllBlogs(Pageable pageable) {
        List<BlogPostDTO> blogPostDTOS = blogPostRepos.findAll().stream().map(BlogPostDTO::new).sorted(
                (o1, o2) -> o2.getCreateDate().compareTo(o1.getCreateDate())
        ).toList();
        return new PageImpl<>(blogPostDTOS, pageable, blogPostDTOS.size());
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
        Account account = blogPost.getAuthor();

        if (account.getRole() == Account.Role.ADMIN) {
            Notification notification = new Notification();
            notification.setAccount(account);
            notification.setType("Admin");
            notification.setMessage("Blog Created By " + account.getNickname() + " " + account.getRole());
            notification.setRead(false);
            notification.setCreateDate(LocalDateTime.now());
            notification.setUpdateDate(LocalDateTime.now());

            NotificationDTO notificationDTO = new NotificationDTO(notification);
            notificationService.sendNotificationToAllMembers(notificationDTO);
        }

            return new BlogPostDTO(blogPostRepos.save(blogPost));
    }

    public BlogPost toEntity(BlogPostDTO blogPostDTO) {
        BlogPost blogPost = new BlogPost();
        blogPost.setPostId(blogPostDTO.getPostId());
        blogPost.setTitle(blogPostDTO.getTitle());
        blogPost.setContent(blogPostDTO.getContent());
        blogPost.setCreateDate(blogPostDTO.getCreateDate());
        blogPost.setUpdateDate(blogPostDTO.getUpdateDate());
        blogPost.setCategory(blogCategoryRepos.findById(blogPostDTO.getCategory().getBlogCategoryId()).orElseThrow(() -> new ResourceNotFoundException("Invalid category id: " + blogPostDTO.getCategory())));
        blogPost.setAuthor(accountRepos.findById(blogPostDTO.getAuthor().getAccountId()).orElseThrow(() -> new ResourceNotFoundException("Invalid author id: " + blogPostDTO.getAuthor())));
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
