package fpt.edu.vn.Backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class BlogUpdateDTO implements Serializable {
    private int postId;
    private int categoryId;
    private int userId;
    private String title;
    private String content;
    private List<MultipartFile> files;
    private List<Integer> deletedFiles;
    private LocalDateTime updateDate;
}
