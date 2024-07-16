package fpt.edu.vn.Backend.DTO.request;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;

@Data
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class KycRequestDTO implements Serializable {
    private MultipartFile frontImage;
    private MultipartFile backImage;
}
