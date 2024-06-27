package fpt.edu.vn.Backend.controller;


import fpt.edu.vn.Backend.DTO.AuctionItemDTO;
import fpt.edu.vn.Backend.pojo.AuctionItemId;
import fpt.edu.vn.Backend.service.AuctionItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auction-items")
@CrossOrigin("*")
public class AuctionItemController {
    @Autowired
    private AuctionItemService auctionItemService;

    @GetMapping("/")
    public ResponseEntity<List<AuctionItemDTO>> getAllAuctionItems(@PageableDefault(size = 30) Pageable pageable) {
        List<AuctionItemDTO> auctionItems = auctionItemService.getAllAuctionItems();
        return new ResponseEntity<>(auctionItems, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuctionItemDTO> getAuctionItemById(@PathVariable("id") AuctionItemId id) {
        AuctionItemDTO auctionItem = auctionItemService.getAuctionItemById(id);
        return new ResponseEntity<>(auctionItem, HttpStatus.OK);
    }

    @PostMapping("/create")
    public ResponseEntity<AuctionItemDTO> createAuctionItem(@RequestBody AuctionItemDTO auctionItemDTO) {
        AuctionItemDTO createdAuctionItem = auctionItemService.createAuctionItem(auctionItemDTO);
        return new ResponseEntity<>(createdAuctionItem, HttpStatus.CREATED);
    }

    @PutMapping("/update")
    public ResponseEntity<AuctionItemDTO> updateAuctionItem(@RequestBody AuctionItemDTO auctionItemDTO) {
        AuctionItemDTO updatedAuctionItem = auctionItemService.updateAuctionItem(auctionItemDTO);
        return new ResponseEntity<>(updatedAuctionItem, HttpStatus.OK);
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity<Void> deleteAuctionItem(@PathVariable("id") AuctionItemId id) {
        auctionItemService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}


