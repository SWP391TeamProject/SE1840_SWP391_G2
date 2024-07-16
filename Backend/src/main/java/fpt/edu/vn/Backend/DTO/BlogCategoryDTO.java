package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.BlogCategory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlogCategoryDTO implements Serializable {
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