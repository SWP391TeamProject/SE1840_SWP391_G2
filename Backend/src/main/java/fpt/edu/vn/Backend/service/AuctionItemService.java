package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.AuctionItemDTO;
import fpt.edu.vn.Backend.pojo.AuctionItem;
import fpt.edu.vn.Backend.pojo.AuctionItemId;

import java.util.List;

public interface AuctionItemService {
    List<AuctionItemDTO> getAllAuctionItems();
    AuctionItemDTO getAuctionItemById(AuctionItemId id);
    AuctionItemDTO createAuctionItem(AuctionItemDTO auctionItemDTO);
    AuctionItemDTO updateAuctionItem(AuctionItemDTO auctionItemDTO);
}
