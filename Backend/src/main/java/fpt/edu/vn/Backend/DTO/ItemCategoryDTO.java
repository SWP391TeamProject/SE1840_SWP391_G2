package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.ItemCategory;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
public class ItemCategoryDTO {
    private int itemCategoryId;
    private String name;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;

    public ItemCategoryDTO(ItemCategory itemCategory) {
        this.itemCategoryId = itemCategory.getItemCategoryId();
        this.name = itemCategory.getName();
        this.createDate = itemCategory.getCreateDate();
        this.updateDate = itemCategory.getUpdateDate();
    }
    // getters and setters
    // ...
}