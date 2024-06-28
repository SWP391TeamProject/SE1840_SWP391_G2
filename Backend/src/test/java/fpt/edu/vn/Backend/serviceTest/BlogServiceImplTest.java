package fpt.edu.vn.Backend.serviceTest;

import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.DTO.BlogCategoryDTO;
import fpt.edu.vn.Backend.DTO.BlogPostDTO;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.BlogCategory;
import fpt.edu.vn.Backend.pojo.BlogPost;
import fpt.edu.vn.Backend.pojo.Notification;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.BlogCategoryRepos;
import fpt.edu.vn.Backend.repository.BlogPostRepos;
import fpt.edu.vn.Backend.repository.NotificationRepos;
import fpt.edu.vn.Backend.service.BlogServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class BlogServiceImplTest {

    @InjectMocks
    private BlogServiceImpl blogService;


    @Mock
    private BlogPostRepos blogPostRepos;

    @Mock
    private AccountRepos accountRepos;

    @Mock
    private BlogCategoryRepos blogCategoryRepos;


    @Mock
    private NotificationRepos notificationRepos;


    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test

    @DisplayName("Should create blog successfully")
    public void createBlogSuccess() {
        BlogCategory blogCategory = new BlogCategory();
        Notification notification = new Notification();
        Account account = new Account();
        account.setAccountId(1);
        blogCategory.setBlogCategoryId(1);
        blogCategory.setName("Test Category");
        notification.setNotificationId(1);
        notification.setAccount(account);
        BlogPost blogPost = new BlogPost();
        blogPost.setPostId(1);
        blogPost.setTitle("Test Title");
        blogPost.setContent("Test Content");
        blogPost.setCreateDate(LocalDateTime.now());
        blogPost.setUpdateDate(LocalDateTime.now());
        blogPost.setCategory(blogCategory);
        blogPost.setAuthor(new Account());

        when(blogCategoryRepos.findById(anyInt())).thenReturn(Optional.of(blogCategory));
        when(accountRepos.findById(anyInt())).thenReturn(Optional.of(new Account()));
        when(blogPostRepos.save(any(BlogPost.class))).thenReturn(blogPost);
        when(notificationRepos.findById(anyInt())).thenReturn(Optional.of(notification));

        BlogPostDTO blogPostDTO  = BlogPostDTO.builder()
                .title(blogPost.getTitle())
                .content(blogPost.getContent())
                .category(new BlogCategoryDTO(blogPost.getCategory()))
                .author(new AccountDTO(blogPost.getAuthor()))
                .createDate(LocalDateTime.now())
                .updateDate(LocalDateTime.now())
                .build();

        BlogPostDTO result = blogService.createBlog(blogPostDTO, 1);

        assertEquals(blogPost.getTitle(), result.getTitle());
        verify(blogPostRepos, times(1)).save(any(BlogPost.class));

    }

    @Test
    @DisplayName("Should update blog successfully")
    public void updateBlogSuccess() {
        BlogCategory blogCategory = new BlogCategory();
        Notification notification = new Notification();
        Account account = new Account();
        account.setAccountId(1);
        notification.setNotificationId(1);
        notification.setAccount(account);
        blogCategory.setBlogCategoryId(1);
        blogCategory.setName("Test Category");

        BlogPost blogPost = new BlogPost();
        blogPost.setPostId(1);
        blogPost.setTitle("Test Title");
        blogPost.setContent("Test Content");
        blogPost.setCreateDate(LocalDateTime.now());
        blogPost.setUpdateDate(LocalDateTime.now());
        blogPost.setCategory(blogCategory);
        blogPost.setAuthor(new Account());

        BlogPost blogPost2 = new BlogPost();
        blogPost2.setPostId(1);
        blogPost2.setTitle("Updated Title");
        blogPost2.setContent("Updated Content");
        blogPost2.setCreateDate(LocalDateTime.now());
        blogPost2.setUpdateDate(LocalDateTime.now());
        blogPost2.setCategory(blogCategory);
        blogPost2.setAuthor(new Account());

        when(blogCategoryRepos.findById(anyInt())).thenReturn(Optional.of(blogCategory));
        when(accountRepos.findById(anyInt())).thenReturn(Optional.of(new Account()));
        when(blogPostRepos.save(any(BlogPost.class))).thenReturn(blogPost2);
        when(blogPostRepos.findById(anyInt())).thenReturn(Optional.of(blogPost));
        when(notificationRepos.findById(anyInt())).thenReturn(Optional.of(notification));


        BlogPostDTO blogPostDTO = BlogPostDTO.builder()
                .postId(blogPost2.getPostId())
                .title(blogPost2.getTitle())
                .content(blogPost2.getContent())
                .category(new BlogCategoryDTO(blogPost2.getCategory()))
                .author(new AccountDTO(blogPost2.getAuthor()))
                .createDate(blogPost2.getCreateDate())
                .updateDate(LocalDateTime.now())
                .build();
        BlogPostDTO result = blogService.createBlog(blogPostDTO, 1);

        assertEquals(blogPost2.getTitle(), result.getTitle());
        verify(blogPostRepos, times(1)).save(any(BlogPost.class));
    }

    @Test
    @DisplayName("Should delete blog successfully")
    public void deleteBlogSuccess() {
        when(blogPostRepos.findByPostId(anyInt())).thenReturn(Optional.of(new BlogPost()));

        blogService.deleteBlog(1);

        verify(blogPostRepos, times(1)).delete(any(BlogPost.class));
    }

    @Test
    @DisplayName("Should get all blogs successfully")
    public void getAllBlogsSuccess() {
        when(blogPostRepos.findAll(any(PageRequest.class))).thenReturn(Page.empty());

        Page<BlogPostDTO> result = blogService.getAllBlogs(PageRequest.of(0, 5));

        assertEquals(0, result.getTotalElements());
    }
}