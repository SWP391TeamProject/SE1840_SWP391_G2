package fpt.edu.vn.Backend.DTO.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaypalCaptureResponseDTO {
    private String response;
    private Integer transId;
}
