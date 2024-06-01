package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.BlogPost;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BlogPostDTO {
    private int postId;
    private int categoryId;
    private int authorId;
    private String title;
    private String content;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;

    public BlogPostDTO(BlogPost blogPost) {
        this.postId = blogPost.getPostId();
        this.categoryId = blogPost.getCategory().getBlogCategoryId();
        this.authorId = blogPost.getAuthor().getAccountId();
        this.title = blogPost.getTitle();
        this.content = blogPost.getContent();
        this.createDate = blogPost.getCreateDate();
        this.updateDate = blogPost.getUpdateDate();
    }
    // getters and setters
    // ...
}