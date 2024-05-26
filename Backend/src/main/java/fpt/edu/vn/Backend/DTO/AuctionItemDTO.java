package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.AuctionItem;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class AuctionItemDTO {
    private int auctionItemId;
    private int auctionSessionId;
    private int itemId;
    private BigDecimal currentPrice;

    public AuctionItemDTO(AuctionItem auctionItem) {
        this.auctionItemId = auctionItem.getAuctionItemId();
        this.auctionSessionId = auctionItem.getAuctionSession().getAuctionSessionId();
        this.itemId = auctionItem.getItem().getItemId();
        this.currentPrice = auctionItem.getCurrentPrice();
    }
}