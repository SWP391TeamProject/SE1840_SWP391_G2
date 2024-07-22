package fpt.edu.vn.Backend.service;

import com.google.common.base.Preconditions;
import fpt.edu.vn.Backend.DTO.AttachmentDTO;
import fpt.edu.vn.Backend.DTO.BlogCreateDTO;
import fpt.edu.vn.Backend.DTO.BlogPostDTO;
import fpt.edu.vn.Backend.DTO.BlogUpdateDTO;
import fpt.edu.vn.Backend.DTO.request.AttachmentUploadDTO;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.BlogPost;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.AttachmentRepos;
import fpt.edu.vn.Backend.repository.BlogCategoryRepos;
import fpt.edu.vn.Backend.repository.BlogPostRepos;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
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
    public Page<BlogPostDTO> getAllBlogs(@Nullable String keyword, @Nullable Integer categoryId,  Pageable pageable) {
        BlogSpecification spec = new BlogSpecification(keyword, categoryId);
        return blogPostRepos.findAll(spec,pageable).map(BlogPostDTO::new);
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
//        if (blogUpdateDTO.getDeletedFiles() != null && !blogUpdateDTO.getDeletedFiles().isEmpty()) {
//            List<AttachmentDTO> attachments = blogPostDTO.getAttachments().stream().toList();
//            for (AttachmentDTO attachmentDTO : attachments) {
//                if (blogUpdateDTO.getDeletedFiles().contains(attachmentDTO.getAttachmentId())) {
//                    int attachmentId = attachmentDTO.getAttachmentId();
//                    ArrayList<AttachmentDTO> newAttachments = new ArrayList<>(blogPostDTO.getAttachments().stream().toList());
//                    newAttachments.remove(attachmentDTO);
//                    blogPostDTO.setAttachments(newAttachments);
//                    blogPostDTO = deleteAttachment(blogPostDTO.getPostId(), attachmentId);
//                    attachmentService.deleteAttachment(attachmentId);
//                }
//            }
//        }
        blogPostDTO = updateBlog(blogPostDTO);
//
//        if (blogUpdateDTO.getFiles() != null && !blogUpdateDTO.getFiles().isEmpty()) {
//            try {
//                for (MultipartFile image : blogUpdateDTO.getFiles()) {
//                    attachmentService.uploadBlogAttachment(image, blogPostDTO.getPostId());
//                }
//            } catch (Exception e) {
//                throw new InvalidInputException("Error uploading attachments");
//            }
//        }

        return blogPostDTO;
    }
    
    @Override
    //@CacheEvict(allEntries = true, value = "blog")
    public void deleteAttachment(int postId, int attachmentId) {
        attachmentService.deleteBlogAttachment(postId, attachmentId);
    }

    @Override
    public List<AttachmentDTO> uploadAttachment(int id, AttachmentUploadDTO dto) throws IOException {
        if (dto.getFiles() == null || dto.getFiles().isEmpty()) return Collections.emptyList();
        for (MultipartFile f : dto.getFiles()) {
            Preconditions.checkState(f.getSize() <= 10000000, "File size must be less than 10MB");
        }
        List<AttachmentDTO> attachments = new ArrayList<>();
        for(MultipartFile file : dto.getFiles()) {
            attachments.add(attachmentService.uploadBlogAttachment(file, id));
        }
        return attachments;
    }

    @Override
    //@CacheEvict(allEntries = true, value = "blog")
    public void deleteBlog(int id) {
        blogPostRepos.delete(blogPostRepos.findByPostId(id).orElseThrow(() -> new ResourceNotFoundException("Invalid blog id: " + id)));
    }

    @Override
   //@Cacheable(key = "#categoryId", value = "blog")
    public Page<BlogPostDTO> getBlogByCategory(int categoryId, Pageable pageable) {
        return blogPostRepos.findAllByCategoryBlogCategoryId(categoryId, pageable).map(BlogPostDTO::new);
    }
}
