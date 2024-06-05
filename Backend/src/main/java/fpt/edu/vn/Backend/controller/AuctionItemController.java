package fpt.edu.vn.Backend.controller;


import fpt.edu.vn.Backend.DTO.AuctionItemDTO;
import fpt.edu.vn.Backend.DTO.request.AuctionItemRequestDTO;
import fpt.edu.vn.Backend.service.AuctionItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auction-items")
@CrossOrigin("*")
public class AuctionItemController {
    private final AuctionItemService auctionItemService;

    @Autowired
    public AuctionItemController(AuctionItemService auctionItemService) {
        this.auctionItemService = auctionItemService;
    }
    @GetMapping("/")
    public ResponseEntity<List<AuctionItemDTO>> getAllAuctionItems() {
        List<AuctionItemDTO> auctionItems = auctionItemService.getAllAuctionItems();
        return new ResponseEntity<>(auctionItems, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuctionItemDTO> getAuctionItemById(@PathVariable("id") int id) {
        AuctionItemDTO auctionItem = auctionItemService.getAuctionItemById(id);
        return new ResponseEntity<>(auctionItem, HttpStatus.OK);
    }

    @PostMapping("/create")
    public ResponseEntity<AuctionItemDTO> createAuctionItem(@RequestBody AuctionItemRequestDTO auctionItemRequestDTO) {
        AuctionItemDTO createdAuctionItem = auctionItemService.createAuctionItem(auctionItemRequestDTO);
        return new ResponseEntity<>(createdAuctionItem, HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<AuctionItemDTO> updateAuctionItem(@PathVariable("id") int id, @RequestBody AuctionItemRequestDTO auctionItemRequestDTO) {
        auctionItemRequestDTO.setAuctionItemId(id);
        AuctionItemDTO updatedAuctionItem = auctionItemService.updateAuctionItem(auctionItemRequestDTO);
        return new ResponseEntity<>(updatedAuctionItem, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAuctionItem(@PathVariable int id) {
        auctionItemService.deleteAuctionItem(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
