package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.AttachmentDTO;
import fpt.edu.vn.Backend.DTO.BlogCreateDTO;
import fpt.edu.vn.Backend.DTO.BlogPostDTO;
import fpt.edu.vn.Backend.DTO.BlogUpdateDTO;
import fpt.edu.vn.Backend.exception.InvalidInputException;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.Attachment;
import fpt.edu.vn.Backend.pojo.BlogPost;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.AttachmentRepos;
import fpt.edu.vn.Backend.repository.BlogCategoryRepos;
import fpt.edu.vn.Backend.repository.BlogPostRepos;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
//@CacheConfig(cacheNames = "blog")
public class BlogServiceImpl implements BlogService {
    private static final Logger log = LoggerFactory.getLogger(BlogServiceImpl.class);
    @Autowired
    private BlogPostRepos blogPostRepos;
    @Autowired
    private AccountRepos accountRepos;
    @Autowired
    private BlogCategoryRepos blogCategoryRepos;

    @Autowired
    private NotificationServiceImpl notificationService;

    @Autowired
    private AttachmentRepos attachmentRepos;

    @Autowired
    private AccountService accountService;

    @Autowired
    private BlogCategoryService blogCategoryService;

    @Autowired
    private AttachmentService attachmentService;


    @Override
   //@Cacheable(key = "#pageable", value = "blog")
    public Page<BlogPostDTO> getAllBlogs(Pageable pageable) {
        return blogPostRepos.findAll(pageable).map(BlogPostDTO::new);
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
   //@Cacheable(key = "#id", value = "blog")
    public BlogPostDTO getBlogById(int id) {
        return blogPostRepos.findByPostId(id).map(BlogPostDTO::new).orElseThrow(() -> new ResourceNotFoundException("Invalid blog id: " + id));
    }

    public BlogPostDTO createBlog(BlogPostDTO BlogPostDTO) {
        BlogPost blogPost = blogPostRepos.save(toEntity(BlogPostDTO));

        notificationService.sendNotificationToUserGroup(
                "New blog post: " + blogPost.getTitle(),
                Account.Role.MEMBER
        );

        return new BlogPostDTO(blogPost);
    }

    @Override
    //@CacheEvict(allEntries = true, value = "blog", beforeInvocation = true)
    public BlogPostDTO createBlog(BlogCreateDTO blogCreateDTO) {
        BlogPostDTO blogPostDTO = new BlogPostDTO();
        blogPostDTO.setTitle(blogCreateDTO.getTitle());
        blogPostDTO.setContent(blogCreateDTO.getContent());
        blogPostDTO.setAuthor(accountService.getAccountById(blogCreateDTO.getUserId()));
        blogPostDTO.setCreateDate(blogCreateDTO.getCreateDate());
        blogPostDTO.setUpdateDate(blogCreateDTO.getUpdateDate());
        blogPostDTO.setCategory(blogCategoryService.getBlogCategoryById(blogCreateDTO.getCategoryId()));
        BlogPost blogPost = blogPostRepos.save(toEntity(blogPostDTO));

        try {
            if (blogCreateDTO.getFiles() != null && !blogCreateDTO.getFiles().isEmpty()) {
                for (MultipartFile image : blogCreateDTO.getFiles()) {
                    log.info("Uploading attachment: " + image.getOriginalFilename());
                    attachmentService.uploadBlogAttachment(image, blogPost.getPostId());
                }
            }
        } catch (Exception e) {
            throw new ResourceNotFoundException("Error uploading attachments");
        }

        return new BlogPostDTO(blogPost);
    }



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
    //@CacheEvict(allEntries = true, value = "blog",cacheNames = "blog")
    public BlogPostDTO updateBlog(BlogUpdateDTO blogUpdateDTO) {
        BlogPostDTO blogPostDTO = blogPostRepos.findByPostId(blogUpdateDTO.getPostId()).map(BlogPostDTO::new).orElseThrow(
                () -> new ResourceNotFoundException("Invalid blog id: " + blogUpdateDTO.getPostId()
                ));
        blogPostDTO.setTitle(blogUpdateDTO.getTitle());
        blogPostDTO.setContent(blogUpdateDTO.getContent());
        blogPostDTO.setUpdateDate(blogUpdateDTO.getUpdateDate());
        blogPostDTO.setCategory(blogCategoryService.getBlogCategoryById(blogUpdateDTO.getCategoryId()));
        if (blogUpdateDTO.getDeletedFiles() != null && !blogUpdateDTO.getDeletedFiles().isEmpty()) {
            List<AttachmentDTO> attachments = blogPostDTO.getAttachments().stream().toList();
            for (AttachmentDTO attachmentDTO : attachments) {
                if (blogUpdateDTO.getDeletedFiles().contains(attachmentDTO.getAttachmentId())) {
                    int attachmentId = attachmentDTO.getAttachmentId();
                    ArrayList<AttachmentDTO> newAttachments = new ArrayList<>(blogPostDTO.getAttachments().stream().toList());
                    newAttachments.remove(attachmentDTO);
                    blogPostDTO.setAttachments(newAttachments);
                    blogPostDTO = deleteAttachment(blogPostDTO.getPostId(), attachmentId);
                    attachmentService.deleteAttachment(attachmentId);
                }
            }
        }
        blogPostDTO = updateBlog(blogPostDTO);

        if (blogUpdateDTO.getFiles() != null && !blogUpdateDTO.getFiles().isEmpty()) {
            try {
                for (MultipartFile image : blogUpdateDTO.getFiles()) {
                    attachmentService.uploadBlogAttachment(image, blogPostDTO.getPostId());
                }
            } catch (Exception e) {
                throw new InvalidInputException("Error uploading attachments");
            }
        }

        return blogPostDTO;
    }

    @Override
    //@CacheEvict(allEntries = true, value = "blog")
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
    //@CacheEvict(allEntries = true, value = "blog")
    public void deleteBlog(int id) {
        blogPostRepos.delete(blogPostRepos.findByPostId(id).orElseThrow(() -> new ResourceNotFoundException("Invalid blog id: " + id)));
    }

    @Override
   //@Cacheable(key = "#keyword", value = "blog")
    public Page<BlogPostDTO> searchBlog(String keyword, Pageable pageable) {
        return blogPostRepos.findAllByContentIsContainingIgnoreCase(keyword, pageable).map(BlogPostDTO::new);
    }

    @Override
   //@Cacheable(key = "#categoryId", value = "blog")
    public Page<BlogPostDTO> getBlogByCategory(int categoryId, Pageable pageable) {
        return blogPostRepos.findAllByCategoryBlogCategoryId(categoryId, pageable).map(BlogPostDTO::new);
    }
}
