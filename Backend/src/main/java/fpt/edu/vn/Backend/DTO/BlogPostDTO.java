package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.BlogPost;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BlogPostDTO {
    private int postId;
    private BlogCategoryDTO category;
    private AccountDTO author;
    private String title;
    private String content;
    private List<AttachmentDTO> attachments;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;

    public BlogPostDTO(BlogPost blogPost) {
        this.postId = blogPost.getPostId();
        this.category = new BlogCategoryDTO(blogPost.getCategory());
        this.author = new AccountDTO(blogPost.getAuthor());
        this.title = blogPost.getTitle();
        this.content = blogPost.getContent();
        this.createDate = blogPost.getCreateDate();
        this.updateDate = blogPost.getUpdateDate();
        this.attachments = blogPost.getAttachments()==null?new ArrayList<>():blogPost.getAttachments().stream().map(AttachmentDTO::new).toList();
        if(author!=null){
            author.setPassword(null);
        }

    }
    // getters and setters
    // ...
}