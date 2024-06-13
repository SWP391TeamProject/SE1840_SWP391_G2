package fpt.edu.vn.Backend.DTO.request;


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
}
