package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.*;
import fpt.edu.vn.Backend.DTO.response.BidResponse;
import fpt.edu.vn.Backend.exception.InvalidInputException;
import fpt.edu.vn.Backend.pojo.AuctionItemId;
import fpt.edu.vn.Backend.service.AccountService;
import fpt.edu.vn.Backend.service.AuctionItemService;
import fpt.edu.vn.Backend.service.AuctionSessionService;
import fpt.edu.vn.Backend.service.BidService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigDecimal;
import java.util.List;
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
    @Autowired
    private AuctionSessionService auctionSessionService;

    @GetMapping("/api/bids/{accountId}")
    public ResponseEntity<Page<BidDTO>> getBidsByAccountId(@PathVariable int accountId, @PageableDefault(size = 50) Pageable pageable) {

        return ResponseEntity.ok(bidService.getBidsByAccountId(accountId, pageable));
    }

    @GetMapping("/api/bids/{auctionSessionId}/{itemId}")
    public ResponseEntity<List<BidResponse>> getBidsByAuctionItemId(@PathVariable int auctionSessionId, @PathVariable int itemId) {
        AuctionItemId auctionItemId = new AuctionItemId(auctionSessionId, itemId);
        return ResponseEntity.ok(bidService.toBidResponse(bidService.getBidsByAuctionItemId(auctionItemId)));
    }

    @MessageMapping("/chat.sendMessage/{auctionSessionId}/{itemId}")
    @SendTo("/topic/public/{auctionSessionId}/{itemId}")
    @Transactional
    public ResponseEntity<BidReplyDTO> sendMessage(@Payload BidDTO bidDTO,
                                                   @DestinationVariable int auctionSessionId,
                                                   @DestinationVariable int itemId,
                                                   SimpMessageHeaderAccessor headerAccessor) {
        try {
            AuctionItemId auctionItemId = new AuctionItemId(auctionSessionId, itemId);
            bidDTO.setAuctionItemId(auctionItemId);
            BigDecimal currentBid = bidService.getHighestBid(auctionItemId).getPayment().getAmount();
            AccountDTO account = (AccountDTO) headerAccessor.getSessionAttributes().get("user");
            log.info(bidDTO.getPayment().getAccountId() + " bid " + bidDTO.getPayment().getAmount() + " on " + bidDTO.getAuctionItemId().getItemId() + "," + bidDTO.getAuctionItemId().getAuctionSessionId());

            if(bidDTO.getPayment().getAccountId() == bidService.getHighestBid(auctionItemId).getPayment().getAccountId()){
                return new ResponseEntity<>(new BidReplyDTO(headerAccessor.getSessionId(),"Right now, you are the highest bidder.\n" +
                        "Hold off until someone outbids you.",null, BidReplyDTO.Status.ERROR), HttpStatus.BAD_REQUEST);
            }

            if (bidDTO.getPayment().getAmount().compareTo(currentBid.add(new BigDecimal(5))) >= 0) {
                bidDTO = bidService.createBid(bidDTO);
                AuctionItemDTO a = auctionItemService.getAuctionItemById(auctionItemId);
                a.setCurrentPrice(bidDTO.getPayment().getAmount());
                auctionItemService.updateAuctionItem(a);
                return ResponseEntity.ok(new BidReplyDTO(account.getNickname() + " bid " + bidDTO.getPayment().getAmount(), bidDTO.getPayment().getAmount(), BidReplyDTO.Status.BID));
            } else {
                return new ResponseEntity<>(new BidReplyDTO(headerAccessor.getSessionId(),"Your bid must be higher than the current bid by at least 5",null, BidReplyDTO.Status.ERROR), HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @MessageMapping("/chat.addUser/{auctionSessionId}/{itemId}")
    @SendTo("/topic/public/{auctionSessionId}/{itemId}")
    @Transactional
    public ResponseEntity<BidReplyDTO> addUser(@Payload BidDTO bidDTO,
                                          @DestinationVariable int auctionSessionId,
                                          @DestinationVariable int itemId, Authentication authentication,
                                          SimpMessageHeaderAccessor headerAccessor) {
        AuctionItemId auctionItemId = new AuctionItemId(auctionSessionId, itemId);
        AuctionSessionDTO auctionSessionDTO = auctionSessionService.getAuctionSessionById(auctionSessionId);
        // Add username in web socket session
        AccountDTO persistedAccount = accountService.getAccountByEmail(authentication.getName());
        if(persistedAccount==null){
            return new ResponseEntity<>(new BidReplyDTO("You are not login yet", BidReplyDTO.Status.ERROR), HttpStatus.BAD_REQUEST);
        }
        if (auctionSessionDTO.getDeposits().stream().noneMatch(depositDTO -> depositDTO.getPayment().getAccountId() == persistedAccount.getAccountId())) {
            return new ResponseEntity<>(new BidReplyDTO("You have not registered to this auction yet", BidReplyDTO.Status.ERROR), HttpStatus.BAD_REQUEST);
        }
        // Add the updated Account to the session attributes
        Objects.requireNonNull(headerAccessor.getSessionAttributes()).put("user", persistedAccount);
        // Create a new bid
//            bidService.createbid(new bid(persistedAccount, new BigDecimal(0), auctionItemService.getAuctionItemById(bidDTO.getAuctionItemId() )));
        return ResponseEntity.ok(new BidReplyDTO(persistedAccount.getNickname() + " join the auction", (bidService.getHighestBid(auctionItemId).getPayment().getAmount()) , BidReplyDTO.Status.JOIN));


    }

}

