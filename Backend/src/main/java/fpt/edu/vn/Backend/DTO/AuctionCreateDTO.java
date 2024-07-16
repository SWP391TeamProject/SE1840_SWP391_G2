package fpt.edu.vn.Backend.DTO;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class AuctionCreateDTO implements Serializable {
    private String title;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private List<MultipartFile> files;
}
