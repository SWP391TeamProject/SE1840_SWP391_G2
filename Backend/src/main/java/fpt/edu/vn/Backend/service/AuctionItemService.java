package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.pojo.AuctionItem;

import java.util.List;

public interface AuctionItemService {
    List<AuctionItem> getAllAuctionItems();
    AuctionItem getAuctionItemById(int id);
}
