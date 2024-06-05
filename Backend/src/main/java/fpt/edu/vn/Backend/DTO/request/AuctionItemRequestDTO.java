package fpt.edu.vn.Backend.DTO.request;


import fpt.edu.vn.Backend.DTO.AuctionItemDTO;
import fpt.edu.vn.Backend.DTO.ItemDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AuctionItemRequestDTO {
    private int auctionItemId;
    private int auctionSessionId;
    private ItemDTO itemDTO;
    private BigDecimal currentPrice;


    public AuctionItemRequestDTO(AuctionItemDTO auctionItemDTO) {
        this.auctionItemId = auctionItemDTO.getAuctionItemId();
        this.auctionSessionId = auctionItemDTO.getAuctionSessionId();
        this.itemDTO = auctionItemDTO.getItemDTO();
        this.currentPrice = auctionItemDTO.getCurrentPrice();
    }
}
