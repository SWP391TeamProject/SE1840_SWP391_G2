package fpt.edu.vn.Backend.DTO.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ItemCategoryRequestDTO implements Serializable {
    private int itemCategoryId;
    private String name;
}
