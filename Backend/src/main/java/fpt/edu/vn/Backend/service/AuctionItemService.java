package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.AuctionItemDTO;
import fpt.edu.vn.Backend.pojo.AuctionItem;

import java.util.List;

public interface AuctionItemService {
    List<AuctionItemDTO> getAllAuctionItems();
    AuctionItemDTO getAuctionItemById(int id);
    AuctionItemDTO createAuctionItem(AuctionItemDTO auctionItemDTO);
    AuctionItemDTO updateAuctionItem(AuctionItemDTO auctionItemDTO);
}
