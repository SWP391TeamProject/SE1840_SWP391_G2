package fpt.edu.vn.Backend.DTO.request;

import fpt.edu.vn.Backend.pojo.Consignment;
import fpt.edu.vn.Backend.pojo.ConsignmentDetail;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

@Data
public class ConsignmentRequestDTO implements Serializable {
    private int accountId;
    private String contactName;
    private String description;
    private String phone;
    private String email;
    private String preferContact;
    private String color;
    private Double weight;
    private String metal;
    private String gemstone;
    private String measurement;
    private String condition;
    private String stamped;
    private List<MultipartFile> files;
}