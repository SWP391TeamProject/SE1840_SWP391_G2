package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Item;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
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
    private AccountDTO buyer;
    private String color;
    private double weight;
    private String metal;
    private String gemstone;
    private String measurement;
    private String condition;
    private String stamped;
    private Integer consignmentRewardPaymentId;
    private Set<AttachmentDTO> attachments;

    public ItemDTO(Item item) {
        this.itemId = item.getItemId();
        if(item.getItemCategory() != null){
            this.category = new ItemCategoryDTO(item.getItemCategory());
        }

        this.name = item.getName();
        this.description = item.getDescription();
        this.reservePrice = item.getReservePrice();
        this.buyInPrice = item.getBuyInPrice();

        this.status = item.getStatus();
        this.createDate = item.getCreateDate();
        this.updateDate = item.getUpdateDate();
        if (item.getOwner() != null) {
            this.owner = AccountDTO.redacted(item.getOwner());
        }
        if (item.getBuyer() != null) {
            this.buyer = AccountDTO.redacted(item.getBuyer());
        }
        this.color = item.getColor();
        this.weight = item.getWeight();
        this.metal = item.getMetal();
        this.gemstone = item.getGemstone();
        this.measurement = item.getMeasurement();
        this.condition = item.getCondition();
        this.stamped = item.getStamped();
        if (item.getStatus() == Item.Status.SOLD &&
                item.getConsignmentRewardPayment() != null)
            this.consignmentRewardPaymentId = item.getConsignmentRewardPayment().getPaymentId();
        if (item.getAttachments() != null)
            this.attachments = item.getAttachments().stream().map(AttachmentDTO::new).collect(Collectors.toSet());
        else
            this.attachments = new HashSet<>();
    }
}