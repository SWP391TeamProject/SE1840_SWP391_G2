package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.*;
import fpt.edu.vn.Backend.DTO.response.BidResponse;
import fpt.edu.vn.Backend.exception.InvalidInputException;
import fpt.edu.vn.Backend.exporter.BidExporter;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.AuctionItemId;
import fpt.edu.vn.Backend.pojo.AuctionSession;
import fpt.edu.vn.Backend.pojo.Bid;
import fpt.edu.vn.Backend.service.AccountService;
import fpt.edu.vn.Backend.service.AuctionItemService;
import fpt.edu.vn.Backend.service.AuctionSessionService;
import fpt.edu.vn.Backend.service.BidService;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;


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

    @GetMapping("/api/bids/auction/{auctionSessionId}")
    public ResponseEntity<List<BidResponse>> getBidsByAuctionId(@PathVariable int auctionSessionId) {
        return ResponseEntity.ok(bidService.toBidResponse(bidService.getBidsByAuctionId(auctionSessionId)));
    }

    @GetMapping("/api/bids/export")
    public ResponseEntity<byte[]> exportToExcel(Authentication authentication) throws IOException {
        AccountDTO account = accountService.getAccountByEmail(authentication.getName());
        if (account == null) {
            throw new InvalidInputException("You are not authorized to perform this action");
        }
        List<BidDTO> listBids;
        {
            listBids = bidService.getBidsByAccountId(account.getAccountId(), PageRequest.of(0, 1000)).toList();
        }

        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
        String currentDateTime = dateFormatter.format(new Date());

        String headerValue = "filename=bids_" + currentDateTime + ".xlsx";

        BidExporter excelExporter = new BidExporter(listBids);

        ByteArrayOutputStream stream = excelExporter.export();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", headerValue);

        return ResponseEntity.ok()
                .headers(headers)
                .body(stream.toByteArray());
    }

    @MessageMapping("/chat.sendMessage/{auctionSessionId}/{itemId}")
    @SendTo("/topic/public/{auctionSessionId}")
    @Transactional
    public ResponseEntity<BidReplyDTO> sendMessage(@Payload BidDTO bidDTO,
                                                   @DestinationVariable int auctionSessionId,
                                                   @DestinationVariable int itemId,
                                                   SimpMessageHeaderAccessor headerAccessor) {
        try {
            AuctionSessionDTO as = auctionSessionService.getAuctionSessionById(auctionSessionId, null);
            if (as == null) {
                throw new InvalidInputException("Auction session not found");
            } else if (as.getStatus() == AuctionSession.Status.FINISHED || as.getStatus() == AuctionSession.Status.TERMINATED) {
                throw new InvalidInputException("Auction session ended");
            } else if (as.getStatus() == AuctionSession.Status.SCHEDULED) {
                throw new InvalidInputException("Auction session not started");
            }
            AuctionItemId auctionItemId = new AuctionItemId(auctionSessionId, itemId);
            bidDTO.setAuctionItemId(auctionItemId);

            BidDTO highestBid = bidService.getHighestBid(auctionItemId);
            BigDecimal currentBid = highestBid == null ? auctionItemService.getAuctionItemById(auctionItemId)
                    .getItemDTO().getReservePrice()
                    : highestBid.getAmount();

            AccountDTO account = new AccountDTO((Account) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("user"));
            log.info(bidDTO.getAccountId() + " bid " + bidDTO.getAmount() + " on " + auctionItemId.getItemId() + "," + auctionItemId.getAuctionSessionId());

            if (highestBid != null && Objects.equals(bidDTO.getAccountId(), highestBid.getAccountId())) {
                return new ResponseEntity<>(new BidReplyDTO(headerAccessor.getSessionId(),auctionItemId, "Right now, you are the highest bidder.\n" +
                        "Hold off until someone outbids you.", null, BidReplyDTO.Status.ERROR), HttpStatus.BAD_REQUEST);
            }
            if (currentBid.compareTo(BigDecimal.valueOf(15000)) < 0) {
                if (bidDTO.getAmount().compareTo(currentBid.add(new BigDecimal(100))) < 0) {
                    return new ResponseEntity<>(new BidReplyDTO(headerAccessor.getSessionId(),auctionItemId, "Your bid must be higher than the current bid by at least 100", null, BidReplyDTO.Status.ERROR), HttpStatus.BAD_REQUEST);
                }
            } else if (currentBid.compareTo(BigDecimal.valueOf(15000)) >= 0 && currentBid.compareTo(BigDecimal.valueOf(50000)) < 0) {
                if (bidDTO.getAmount().compareTo(currentBid.add(new BigDecimal(250))) < 0) {
                    return new ResponseEntity<>(new BidReplyDTO(headerAccessor.getSessionId(),auctionItemId, "Your bid must be higher than the current bid by at least 250", null, BidReplyDTO.Status.ERROR), HttpStatus.BAD_REQUEST);
                }
            } else if (currentBid.compareTo(BigDecimal.valueOf(50000)) >= 0 && currentBid.compareTo(BigDecimal.valueOf(200000)) < 0) {
                if (bidDTO.getAmount().compareTo(currentBid.add(new BigDecimal(500))) < 0) {
                    return new ResponseEntity<>(new BidReplyDTO(headerAccessor.getSessionId(),auctionItemId, "Your bid must be higher than the current bid by at least 500", null, BidReplyDTO.Status.ERROR), HttpStatus.BAD_REQUEST);
                }
            } else {
                if (bidDTO.getAmount().compareTo(currentBid.add(new BigDecimal(1000))) < 0) {
                    return new ResponseEntity<>(new BidReplyDTO(headerAccessor.getSessionId(),auctionItemId, "Your bid must be higher than the current bid by at least 1000", null, BidReplyDTO.Status.ERROR), HttpStatus.BAD_REQUEST);
                }
            }
            bidDTO.setStatus(Bid.Status.PENDING);
            bidDTO = bidService.createBid(bidDTO);
            AuctionItemDTO a = auctionItemService.getAuctionItemById(auctionItemId);
            a.setCurrentPrice(bidDTO.getAmount());
            auctionItemService.updateAuctionItem(a);
            return ResponseEntity.ok(new BidReplyDTO(account.getNickname() + " bid " + bidDTO.getAmount(), bidDTO.getAmount(), BidReplyDTO.Status.BID));
        } catch (Exception e) {
            throw new InvalidInputException(e.getMessage());
        }
    }

    @MessageMapping("/chat.addUser/{auctionSessionId}/{itemId}")
    @SendTo("/topic/public/{auctionSessionId}")
    @Transactional
    public ResponseEntity<BidReplyDTO> addUser(@Payload BidDTO bidDTO,
                                               @DestinationVariable int auctionSessionId,
                                               @DestinationVariable int itemId, Authentication authentication,
                                               SimpMessageHeaderAccessor headerAccessor) {
        return ResponseEntity.ok(bidService.addUser(bidDTO, auctionSessionId, itemId, authentication, headerAccessor));
    }
}

