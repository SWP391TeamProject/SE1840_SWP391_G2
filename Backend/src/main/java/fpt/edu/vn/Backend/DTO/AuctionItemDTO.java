package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.AuctionItem;
import fpt.edu.vn.Backend.pojo.AuctionItemId;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;


import java.io.Serializable;
import java.math.BigDecimal;

@Data
@Getter
@Setter
@NoArgsConstructor

public class AuctionItemDTO implements Serializable {
    private AuctionItemId id;
    private ItemDTO itemDTO;
    private BigDecimal currentPrice;
    private BigDecimal highestBid;
    private int numberOfBids;
    public AuctionItemDTO(AuctionItem auctionItem) {
        this.id = auctionItem.getAuctionItemId();
        this.itemDTO = new ItemDTO(auctionItem.getItem());
        this.currentPrice = auctionItem.getCurrentPrice();
        this.highestBid = auctionItem.getBids().stream().map(bid -> bid.getPayment().getPaymentAmount()).max(BigDecimal::compareTo).orElse(BigDecimal.ZERO);
        this.numberOfBids = auctionItem.getBids().size();
    }

}