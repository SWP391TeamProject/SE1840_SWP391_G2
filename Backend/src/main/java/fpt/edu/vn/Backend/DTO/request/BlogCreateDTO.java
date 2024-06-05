package fpt.edu.vn.Backend.DTO.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BlogCreateDTO {
    private int postId;
    private int categoryId;
    private int userId;
    private String title;
    private String content;
    private List<MultipartFile> images;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;

}