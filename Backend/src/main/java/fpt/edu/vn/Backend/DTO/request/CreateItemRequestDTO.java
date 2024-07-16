package fpt.edu.vn.Backend.DTO.request;

import fpt.edu.vn.Backend.DTO.ItemDTO;
import fpt.edu.vn.Backend.pojo.Item;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateItemRequestDTO implements Serializable {
    private ItemDTO item;
    private List<MultipartFile> files;
}
