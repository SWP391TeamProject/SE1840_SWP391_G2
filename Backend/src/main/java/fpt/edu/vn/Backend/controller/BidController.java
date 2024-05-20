package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.service.AccountService;
import fpt.edu.vn.Backend.service.AuctionBidService;
import fpt.edu.vn.Backend.service.AuctionItemService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;


@Controller
public class BidController {
    private static final Logger log = LoggerFactory.getLogger(BidController.class);
    @Autowired
    private AuctionBidService auctionBidService;
    @Autowired
    private AccountService accountService;
    @Autowired
    private AuctionItemService auctionItemService;
//    @MessageMapping("/chat.sendMessage")
//    @SendTo("/topic/public")
//    public ResponseEntity<String> sendMessage(@Payload AuctionBidDTO auctionBidDTO,
//                                                     SimpMessageHeaderAccessor headerAccessor) {
//        AuctionBid auctionBid = new AuctionBid();
//        BigDecimal bid = auctionBidDTO.getPrice()==null?new BigDecimal(0):auctionBidDTO.getPrice();
//        auctionBid.setAccount((Account) headerAccessor.getSessionAttributes().get("user"));
//        auctionBid.setPrice(bid);
//        auctionBid.setAuctionItem(auctionItemService.getAuctionItemById(auctionBidDTO.getBidId().getAuctionItemId()));
//        BigDecimal currentBid = auctionBidService.getHighestAuctionBid(auctionBid.getAuctionItem().getAuctionItemId()) != null ? auctionBidService.getHighestAuctionBid(auctionBid.getAuctionItem().getAuctionItemId()).getPrice() : new BigDecimal(0);
//        log.info(auctionBid.getAccount().getEmail() + " bid " + auctionBid.getPrice() + " on " + auctionBid.getAuctionItem().getAuctionItemId());
//
//        try {
//            if (bid.compareTo(currentBid.add(new BigDecimal(5))) >= 0) {
//                Account account = (Account) headerAccessor.getSessionAttributes().get("user");
//                Account persistedAccount = accountService.getAccountByEmail(auctionBid.getAccount().getEmail());
//                if (persistedAccount == null) {
//                    persistedAccount = accountService.createAccount(account);
//                }
//                auctionBid.setAccount(persistedAccount);
//                auctionBidService.createAuctionBid(auctionBid);
//                return ResponseEntity.ok(auctionBid.getAccount().getNickname() + " : " + auctionBid.getPrice() +":BID");
//            } else {
//                return new ResponseEntity<>(headerAccessor.getSessionId() + " : Bid must be higher than " + currentBid.add(new BigDecimal(5))+":ERROR"
//                        ,HttpStatus.BAD_REQUEST);
//            }
//        } catch (Exception e) {
//            log.error(e.getMessage());
//            return new ResponseEntity<>(headerAccessor.getSessionId()+": Please input number:ERROR",HttpStatus.NOT_ACCEPTABLE);
//        }
//    }
//
//    @MessageMapping("/chat.addUser")
//    @SendTo("/topic/public")
//    public ResponseEntity<String> addUser(@Payload AuctionBidDTO auctionBidDTO, SimpMessageHeaderAccessor headerAccessor) {
//        // Add username in web socket session
//        Account persistedAccount = accountService.getAccountById(auctionBidDTO.getBidId().getAccountId());
//        if (persistedAccount != null) {
//            // Add the updated Account to the session attributes
//            headerAccessor.getSessionAttributes().put("user", persistedAccount);
//            // Create a new AuctionBid
////            auctionBidService.createAuctionBid(new AuctionBid(persistedAccount, new BigDecimal(0), auctionItemService.getAuctionItemById(auctionBidDTO.getAuctionItemId() )));
//            return ResponseEntity.ok(persistedAccount.getNickname() + " join the auction : " + (auctionBidService.getHighestAuctionBid(auctionBidDTO.getBidId().getAuctionItemId()) == null ? 0 : auctionBidService.getHighestAuctionBid(auctionBidDTO.getBidId().getAuctionItemId()).getPrice())+":JOIN");
//        } else {
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        }
//
//    }

}

