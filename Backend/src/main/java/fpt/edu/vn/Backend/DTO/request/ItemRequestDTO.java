package fpt.edu.vn.Backend.DTO.request;

import fpt.edu.vn.Backend.pojo.Item;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemRequestDTO implements Serializable {
    private int itemId;
    private String name;
    private String description;
    private BigDecimal BuyInPrice;

    private int itemCategoryId;

    private Item.Status status;


    public ItemRequestDTO(Item item) {
        this.itemId = item.getItemId();
        this.name = item.getName();
        this.description = item.getDescription();
        this.BuyInPrice = item.getBuyInPrice();
        this.itemCategoryId = item.getItemCategory().getItemCategoryId();
        this.status = item.getStatus();
    }

}
