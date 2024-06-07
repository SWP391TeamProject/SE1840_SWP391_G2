package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.DTO.AuctionItemDTO;
import fpt.edu.vn.Backend.DTO.BidDTO;
import fpt.edu.vn.Backend.pojo.AuctionItemId;
import fpt.edu.vn.Backend.service.AccountService;
import fpt.edu.vn.Backend.service.BidService;
import fpt.edu.vn.Backend.service.AuctionItemService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.Objects;
import java.util.Set;


@RestController
public class BidController {
    private static final Logger log = LoggerFactory.getLogger(BidController.class);
    @Autowired
    private BidService bidService;
    @Autowired
    private AccountService accountService;
    @Autowired
    private AuctionItemService auctionItemService;

    @GetMapping("/api/bids/{accountId}")
    public ResponseEntity<Page<BidDTO>> getBidsByAccountId(@PathVariable int accountId, @RequestParam(defaultValue = "0") int pageNumb,@RequestParam(defaultValue = "50") int pageSize) {
        Pageable pageable = PageRequest.of(pageNumb,pageSize);

        return ResponseEntity.ok(bidService.getBidsByAccountId(accountId, pageable));
    }

    @MessageMapping("/chat.sendMessage/{auctionSessionId}/{itemId}")
    @SendTo("/topic/public/{auctionSessionId}/{itemId}")
    public ResponseEntity<BidDTO> sendMessage(@Payload BidDTO bidDTO,
                                              @DestinationVariable int auctionSessionId,
                                              @DestinationVariable int itemId,
                                              SimpMessageHeaderAccessor headerAccessor) {
        try {
            AuctionItemId auctionItemId = new AuctionItemId(auctionSessionId, itemId);
            bidDTO.setAuctionItemId(auctionItemId);
            BigDecimal currentBid = bidService.getHighestBid(auctionItemId).getPayment().getAmount();
            AccountDTO account = (AccountDTO) headerAccessor.getSessionAttributes().get("user");
            log.info(account.getEmail() + " bid " + bidDTO.getPayment().getAmount() + " on " + bidDTO.getAuctionItemId());

            if (bidDTO.getPayment().getAmount().compareTo(currentBid.add(new BigDecimal(5))) >= 0) {
                bidDTO = bidService.createBid(bidDTO);
                AuctionItemDTO a = auctionItemService.getAuctionItemById(auctionItemId);
                a.setCurrentPrice(bidDTO.getPayment().getAmount());
                auctionItemService.updateAuctionItem(a);
                return ResponseEntity.ok(bidDTO);
            } else {
                throw new Exception("Bid must be higher than current bid by at least 5");
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @MessageMapping("/chat.addUser/{auctionSessionId}/{itemId}")
    @SendTo("/topic/public/{auctionSessionId}/{itemId}")
    public ResponseEntity<String> addUser(@Payload BidDTO bidDTO,
                                          @DestinationVariable int auctionSessionId,
                                          @DestinationVariable int itemId, Authentication authentication,
                                          SimpMessageHeaderAccessor headerAccessor) {
        AuctionItemId auctionItemId = new AuctionItemId(auctionSessionId, itemId);
        // Add username in web socket session
        AccountDTO persistedAccount = accountService.getAccountByEmail(authentication.getName());
        if (persistedAccount != null) {
            // Add the updated Account to the session attributes
            Objects.requireNonNull(headerAccessor.getSessionAttributes()).put("user", persistedAccount);
            // Create a new bid
//            bidService.createbid(new bid(persistedAccount, new BigDecimal(0), auctionItemService.getAuctionItemById(bidDTO.getAuctionItemId() )));
            return ResponseEntity.ok(persistedAccount.getNickname() + " join the auction : " + (bidService.getHighestBid(auctionItemId).getPayment().getAmount()) + ":JOIN");
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }

}

