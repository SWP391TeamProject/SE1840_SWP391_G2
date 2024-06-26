package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Item;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
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
        this.owner = new AccountDTO(item.getOwner());
        this.orderId = item.getOrder()==null?null:item.getOrder().getOrderId();
        this.attachments = item.getAttachments().stream().map(AttachmentDTO::new).collect(Collectors.toSet());
        if(owner!=null){
            owner.setPassword(null);
        }
    }
}