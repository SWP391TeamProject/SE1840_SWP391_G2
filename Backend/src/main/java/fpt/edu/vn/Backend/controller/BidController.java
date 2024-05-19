package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.AuctionBidDTO;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.AuctionBid;

import fpt.edu.vn.Backend.service.AccountService;
import fpt.edu.vn.Backend.service.AuctionBidService;
import fpt.edu.vn.Backend.service.AuctionItemService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.math.BigDecimal;


@Controller
public class BidController {
    private static final Logger log = LoggerFactory.getLogger(BidController.class);
    @Autowired
    private AuctionBidService auctionBidService;
    @Autowired
    private AccountService accountService;
    @Autowired
    private AuctionItemService auctionItemService;
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ResponseEntity<String> sendMessage(@Payload AuctionBidDTO auctionBidDTO,
                                                     SimpMessageHeaderAccessor headerAccessor) {
        AuctionBid auctionBid = new AuctionBid();
        BigDecimal bid = auctionBidDTO.getPrice()==null?new BigDecimal(0):auctionBidDTO.getPrice();
        auctionBid.setBidder((Account) headerAccessor.getSessionAttributes().get("user"));
        auctionBid.setPrice(bid);
        auctionBid.setBidType(AuctionBid.BidType.CHAT);
        auctionBid.setAuctionItem(auctionItemService.getAuctionItemById(auctionBidDTO.getAuctionItemId()));
        BigDecimal currentBid = auctionBidService.getHighestAuctionBid(auctionBid.getAuctionItem().getAuctionItemId()) != null ? auctionBidService.getHighestAuctionBid(auctionBid.getAuctionItem().getAuctionItemId()).getPrice() : new BigDecimal(0);
        log.info(auctionBid.getBidder().getEmail() + " bid " + auctionBid.getPrice() + " on " + auctionBid.getAuctionItem().getAuctionItemId());

        try {
            if (bid.compareTo(currentBid.add(new BigDecimal(5))) >= 0) {
                Account account = (Account) headerAccessor.getSessionAttributes().get("user");
                Account persistedAccount = accountService.getAccountByEmail(auctionBid.getBidder().getEmail());
                if (persistedAccount == null) {
                    persistedAccount = accountService.saveAccount(account);
                }
                auctionBid.setBidder(persistedAccount);
                auctionBidService.createAuctionBid(auctionBid);
                return ResponseEntity.ok(auctionBid.getBidder().getNickname() + " : " + auctionBid.getPrice() +":BID");
            } else {
                return new ResponseEntity<>(headerAccessor.getSessionId() + " : Bid must be higher than " + currentBid.add(new BigDecimal(5))+":ERROR"
                        ,HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            return new ResponseEntity<>(headerAccessor.getSessionId()+": Please input number:ERROR",HttpStatus.NOT_ACCEPTABLE);
        }
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ResponseEntity<String> addUser(@Payload AuctionBidDTO auctionBidDTO, SimpMessageHeaderAccessor headerAccessor) {
        // Add username in web socket session
        Account persistedAccount = accountService.getAccountById(auctionBidDTO.getBidderId());
        if (persistedAccount != null) {
            // Add the updated Account to the session attributes
            headerAccessor.getSessionAttributes().put("user", persistedAccount);
            // Create a new AuctionBid
            auctionBidService.createAuctionBid(new AuctionBid(persistedAccount, AuctionBid.BidType.JOIN, new BigDecimal(0), auctionItemService.getAuctionItemById(auctionBidDTO.getAuctionItemId() )));
            return ResponseEntity.ok(persistedAccount.getNickname() + " join the auction : " + (auctionBidService.getHighestAuctionBid(auctionBidDTO.getAuctionItemId()) == null ? 0 : auctionBidService.getHighestAuctionBid(auctionBidDTO.getAuctionItemId()).getPrice())+":JOIN");
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }

}

