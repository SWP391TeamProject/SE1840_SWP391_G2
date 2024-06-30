package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.ItemCategory;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;
@Data
@NoArgsConstructor
public class ItemCategoryDTO implements Serializable {
    private int itemCategoryId;
    private String name;
    private LocalDateTime createDate;
    public ItemCategoryDTO(ItemCategory itemCategory) {
        this.itemCategoryId = itemCategory.getItemCategoryId();
        this.name = itemCategory.getName();
        this.createDate = itemCategory.getCreateDate();
    }
    // getters and setters
    // ...
}