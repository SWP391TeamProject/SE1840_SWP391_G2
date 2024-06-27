package fpt.edu.vn.Backend.DTO.request;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;
@Data
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class KycRequestDTO {
    private MultipartFile frontImage;
    private MultipartFile backImage;
}
