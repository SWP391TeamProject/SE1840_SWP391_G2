package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.BidDTO;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.Bid;
import fpt.edu.vn.Backend.service.AccountService;
import fpt.edu.vn.Backend.service.AuctionBidService;
import fpt.edu.vn.Backend.service.AuctionItemService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
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
    private AuctionBidService bidService;
    @Autowired
    private AccountService accountService;
    @Autowired
    private AuctionItemService auctionItemService;
    @MessageMapping("/chat.sendMessage/{auctionItemId}")
    @SendTo("/topic/public/{auctionItemId}")
    public ResponseEntity<BidDTO> sendMessage(@Payload BidDTO bidDTO, @DestinationVariable int auctionItemId,
                                              SimpMessageHeaderAccessor headerAccessor) {
        try {
            Bid bid = new Bid();
            BigDecimal amount = bidDTO.getPrice();
            bid.setAccount((Account) headerAccessor.getSessionAttributes().get("user"));
            bid.setPrice(amount);
            bid.setAuctionItem(auctionItemService.getAuctionItemById(auctionItemId));
            BigDecimal currentBid = bidService.getHighestAuctionBid(auctionItemId) != null ? bidService.getHighestAuctionBid(auctionItemId).getPrice() : new BigDecimal(0);
            log.info(bid.getAccount().getEmail() + " bid " + bid.getPrice() + " on " + bid.getAuctionItem().getAuctionItemId());

            if (bid.getPrice().compareTo(currentBid.add(new BigDecimal(5))) >= 0) {
                Account account = (Account) headerAccessor.getSessionAttributes().get("user");
                Account persistedAccount = accountService.getAccountByEmail(bid.getAccount().getEmail());
                if (persistedAccount == null) {
                    persistedAccount = accountService.createAccount(account);
                }
                bid.setAccount(persistedAccount);
                bidService.createAuctionBid(bid);
                BidDTO response = new BidDTO();
                response.setBidId(bid.getBidId());
                response.setAccountId(persistedAccount.getAccountId());
                response.setPrice(bid.getPrice());
                response.setAuctionItemId(bid.getAuctionItem().getAuctionItemId());
                return ResponseEntity.ok(response);
            } else {
                throw new Exception("Bid must be higher than current bid by at least 5");
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @MessageMapping("/chat.addUser/{auctionItemId}")
    @SendTo("/topic/public/{auctionItemId}")
    public ResponseEntity<String> addUser(@Payload BidDTO bidDTO,@DestinationVariable int auctionItemId, SimpMessageHeaderAccessor headerAccessor) {
        // Add username in web socket session
        Account persistedAccount = accountService.getAccountById(bidDTO.getAccountId());
        if (persistedAccount != null) {
            // Add the updated Account to the session attributes
            headerAccessor.getSessionAttributes().put("user", persistedAccount);
            // Create a new bid
//            bidService.createbid(new bid(persistedAccount, new BigDecimal(0), auctionItemService.getAuctionItemById(bidDTO.getAuctionItemId() )));
            return ResponseEntity.ok(persistedAccount.getNickname() + " join the auction : " + (bidService.getHighestAuctionBid(auctionItemId) == null ? 0 : bidService.getHighestAuctionBid(auctionItemId).getPrice())+":JOIN");
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }

}

