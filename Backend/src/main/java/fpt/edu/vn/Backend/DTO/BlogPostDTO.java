package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.BlogPost;
import lombok.Data;

import java.time.LocalDateTime;
@Data
public class BlogPostDTO {
    private int postId;
    private int categoryId;
    private int userId;
    private String title;
    private String content;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;

    BlogPostDTO(BlogPost blogPost) {
        this.postId = blogPost.getPostId();
        this.categoryId = blogPost.getCategory().getBlogCategoryId();
        this.userId = blogPost.getUser().getUserId();
        this.title = blogPost.getTitle();
        this.content = blogPost.getContent();
        this.createDate = blogPost.getCreateDate();
        this.updateDate = blogPost.getUpdateDate();
    }
    // getters and setters
    // ...
}