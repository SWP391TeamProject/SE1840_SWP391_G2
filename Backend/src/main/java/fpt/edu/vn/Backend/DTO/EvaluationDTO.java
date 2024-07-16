package fpt.edu.vn.Backend.DTO;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

@Data
public class EvaluationDTO implements Serializable {
    private int accountId;
    private String evaluation;
    private BigDecimal price;
    private int consignmentId;
    private List<MultipartFile> files;
}