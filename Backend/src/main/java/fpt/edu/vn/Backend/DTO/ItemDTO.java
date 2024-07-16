package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Item;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemDTO implements Serializable {
    private Integer itemId;
    private ItemCategoryDTO category;
    private String name;
    private String description;
    private BigDecimal reservePrice;
    private BigDecimal buyInPrice;
    private Item.Status status;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;
    private AccountDTO owner;
    private String color;
    private String size;
    private String weight;
    private String brand;
    private Integer age;
    private String material;
    private Integer orderId;
    private Set<AttachmentDTO> attachments;

    public ItemDTO(Item item) {
        this.itemId = item.getItemId();
        this.category = new ItemCategoryDTO(item.getItemCategory());
        this.name = item.getName();
        this.description = item.getDescription();
        this.reservePrice = item.getReservePrice();
        this.buyInPrice = item.getBuyInPrice();
        this.status = item.getStatus();
        this.createDate = item.getCreateDate();
        this.updateDate = item.getUpdateDate();
        this.owner = AccountDTO.redacted(item.getOwner());
        this.color = item.getColor();
        this.size = item.getSize();
        this.weight = item.getWeight();
        this.brand = item.getBrand();
        this.age = item.getAge();
        this.material = item.getMaterial();
        if (item.getOrder() != null)
            this.orderId = item.getOrder().getOrderId();
        this.attachments = item.getAttachments().stream().map(AttachmentDTO::new).collect(Collectors.toSet());
    }
}