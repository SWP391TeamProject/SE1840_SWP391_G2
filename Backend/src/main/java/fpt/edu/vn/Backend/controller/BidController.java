package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.DTO.AuctionItemDTO;
import fpt.edu.vn.Backend.DTO.BidDTO;
import fpt.edu.vn.Backend.DTO.request.AuctionItemRequestDTO;
import fpt.edu.vn.Backend.service.AccountService;
import fpt.edu.vn.Backend.service.BidService;
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
import java.util.Objects;


@Controller
public class BidController {
    private static final Logger log = LoggerFactory.getLogger(BidController.class);
    @Autowired
    private BidService bidService;
    @Autowired
    private AccountService accountService;
    @Autowired
    private AuctionItemService auctionItemService;

    @MessageMapping("/chat.sendMessage/{auctionItemId}")
    @SendTo("/topic/public/{auctionItemId}")
    public ResponseEntity<BidDTO> sendMessage(@Payload BidDTO bidDTO, @DestinationVariable int auctionItemId,
                                              SimpMessageHeaderAccessor headerAccessor) {
        try {
            bidDTO.setAuctionItemId(auctionItemId);
            BigDecimal currentBid = bidService.getHighestBid(auctionItemId).getPrice();
            AccountDTO account = (AccountDTO) headerAccessor.getSessionAttributes().get("user");
            log.info(account.getEmail() + " bid " + bidDTO.getPrice() + " on " + bidDTO.getAuctionItemId());

            if (bidDTO.getPrice().compareTo(currentBid.add(new BigDecimal(5))) >= 0) {
                bidDTO = bidService.createBid(bidDTO);
                AuctionItemDTO a = auctionItemService.getAuctionItemById(auctionItemId);
                a.setCurrentPrice(bidDTO.getPrice());
                AuctionItemRequestDTO auctionItemRequestDTO = new AuctionItemRequestDTO(a);
                auctionItemService.updateAuctionItem(auctionItemRequestDTO);
                return ResponseEntity.ok(bidDTO);
            } else {
                throw new Exception("Bid must be higher than current bid by at least 5");
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @MessageMapping("/chat.addUser/{auctionItemId}")
    @SendTo("/topic/public/{auctionItemId}")
    public ResponseEntity<String> addUser(@Payload BidDTO bidDTO, @DestinationVariable int auctionItemId, SimpMessageHeaderAccessor headerAccessor) {
        // Add username in web socket session
        AccountDTO persistedAccount = accountService.getAccountById(bidDTO.getAccountId());
        if (persistedAccount != null) {
            // Add the updated Account to the session attributes
            Objects.requireNonNull(headerAccessor.getSessionAttributes()).put("user", persistedAccount);
            // Create a new bid
//            bidService.createbid(new bid(persistedAccount, new BigDecimal(0), auctionItemService.getAuctionItemById(bidDTO.getAuctionItemId() )));
            return ResponseEntity.ok(persistedAccount.getNickname() + " join the auction : " + (bidService.getHighestBid(auctionItemId).getPrice()) + ":JOIN");
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }

}

