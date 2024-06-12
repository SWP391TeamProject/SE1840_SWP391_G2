package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.AuctionItem;
import fpt.edu.vn.Backend.pojo.AuctionItemId;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
public class AuctionItemDTO {
    private AuctionItemId id;
    private ItemDTO itemDTO;
    private BigDecimal currentPrice;

    public AuctionItemDTO(AuctionItem auctionItem) {
        this.id = auctionItem.getAuctionItemId();
        this.itemDTO = new ItemDTO(auctionItem.getItem());
        this.currentPrice = auctionItem.getCurrentPrice();
    }

}