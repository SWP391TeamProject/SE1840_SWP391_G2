package fpt.edu.vn.Backend.DTO;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class BlogCreateDTO implements Serializable {
    private int postId;
    private int categoryId;
    private int userId;
    private String title;
    private String content;
    private List<MultipartFile> files;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;
}