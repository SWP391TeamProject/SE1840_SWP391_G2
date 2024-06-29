package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.AttachmentDTO;
import fpt.edu.vn.Backend.DTO.BlogPostDTO;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.Attachment;
import fpt.edu.vn.Backend.pojo.BlogPost;
import fpt.edu.vn.Backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class BlogServiceImpl implements BlogService {
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
    @Autowired
    private AttachmentService attachmentService;
    @Autowired
    private AttachmentRepos attachmentRepos;


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
//        Account account = blogPost.getAuthor();
//
//        if (account.getRole() == Account.Role.ADMIN) {
//            Notification notifications = notificationRepos.findByAccount_AccountId(account.getAccountId())
//                    .orElseThrow(() -> new ResourceNotFoundException("Account", "id", account.getAccountId()));
//            Notification notification = notificationRepos.findById(notifications.getNotificationId())
//                    .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notifications.getNotificationId()));
//            NotificationDTO notificationDTO = new NotificationDTO(notification);
//            notificationService.sendNotificationToAllMembers(notificationDTO);
//        }

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
            blogPost.setCategory(blogCategoryRepos.findById(BlogPostDTO.getCategory().getBlogCategoryId()).orElseThrow(
                    () -> new ResourceNotFoundException("Invalid category id: " + BlogPostDTO.getCategory())));
            return new BlogPostDTO(blogPostRepos.save(blogPost));
        }).orElseThrow(() -> new ResourceNotFoundException("Invalid blog id: " + BlogPostDTO.getPostId()));
    }

    @Override
    public BlogPostDTO deleteAttachment(int postId, int attachmentId) {
        BlogPost blogPost = blogPostRepos.findById(postId).orElseThrow(() -> new ResourceNotFoundException("Invalid blog id: " + postId));
        List<AttachmentDTO> attachmentDTOS = blogPost.getAttachments().stream().map(AttachmentDTO::new).toList();
        List<Attachment> attachments = new ArrayList<>();
        for (AttachmentDTO attachmentDTO : attachmentDTOS) {
            if (attachmentDTO.getAttachmentId() != attachmentId) {
                attachments.add(
                        attachmentRepos.findById(attachmentDTO.getAttachmentId())
                                .orElseThrow(
                                        () -> new ResourceNotFoundException("Invalid attachment id: " + attachmentDTO.getAttachmentId())
                                ));
            }
        }
        blogPost.setAttachments(attachments);
        return new BlogPostDTO(blogPostRepos.save(blogPost));
    }

    @Override
    public void deleteBlog(int id) {
        blogPostRepos.delete(blogPostRepos.findByPostId(id).orElseThrow(() -> new ResourceNotFoundException("Invalid blog id: " + id)));
    }

    @Override
    public Page<BlogPostDTO> searchBlog(String keyword, Pageable pageable) {
        return blogPostRepos.findAllByContentIsContainingIgnoreCase(keyword, pageable).map(BlogPostDTO::new);
    }

    @Override
    public Page<BlogPostDTO> getBlogByCategory(int categoryId, Pageable pageable) {
        return blogPostRepos.findAllByCategoryBlogCategoryId(categoryId, pageable).map(BlogPostDTO::new);
    }
}
