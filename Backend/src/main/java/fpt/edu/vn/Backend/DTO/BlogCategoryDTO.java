package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.BlogCategory;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BlogCategoryDTO {
    private int blogCategoryId;
    private String name;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;

    public BlogCategoryDTO(BlogCategory blogCategory) {
        this.blogCategoryId = blogCategory.getBlogCategoryId();
        this.name = blogCategory.getName();
        this.createDate = blogCategory.getCreateDate();
        this.updateDate = blogCategory.getUpdateDate();
    }
    // getters and setters
    // ...
}