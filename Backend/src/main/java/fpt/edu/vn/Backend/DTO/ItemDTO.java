package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Item;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
@Data
public class ItemDTO {
    private int itemId;
    private String name;
    private String description;
    private BigDecimal reservePrice;
    private BigDecimal buyInPrice;
    private String status;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;
    private int categoryId;
    private Integer orderId;

    ItemDTO(Item item) {
        this.itemId = item.getItemId();
        this.name = item.getName();
        this.description = item.getDescription();
        this.reservePrice = item.getReservePrice();
        this.buyInPrice = item.getBuyInPrice();
        this.status = item.getStatus();
        this.createDate = item.getCreateDate();
        this.updateDate = item.getUpdateDate();
        this.categoryId = item.getCategory().getItemCategoryId();
        this.orderId = item.getOrder().getOrderId();
    }
    // getters and setters
    // ...
}