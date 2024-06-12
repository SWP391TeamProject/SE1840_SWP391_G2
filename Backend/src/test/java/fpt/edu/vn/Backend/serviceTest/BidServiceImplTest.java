package fpt.edu.vn.Backend.serviceTest;

import fpt.edu.vn.Backend.DTO.BidDTO;
import fpt.edu.vn.Backend.DTO.PaymentDTO;
import fpt.edu.vn.Backend.pojo.*;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.AuctionItemRepos;
import fpt.edu.vn.Backend.repository.BidRepos;
import fpt.edu.vn.Backend.repository.PaymentRepos;
import fpt.edu.vn.Backend.service.BidServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class BidServiceImplTest {

    @Mock
    BidRepos bidRepos;

    @Mock
    AuctionItemRepos auctionItemRepos;

    @Mock
    PaymentRepos paymentRepos;

    @Mock
    AccountRepos accountRepos;


    @InjectMocks
    BidServiceImpl bidService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllBids_HappyPath() {
        when(bidRepos.findAll()).thenReturn(new ArrayList<>());
        assertNotNull(bidService.getAllBids());
    }

    @Test
    void getBidsByAuctionItemId_HappyPath() {
        when(bidRepos.findAllBidByAuctionItem_AuctionItemIdOrderByPayment_PaymentAmountDesc(any())).thenReturn(new ArrayList<>());
        assertNotNull(bidService.getBidsByAuctionItemId(new AuctionItemId()));
    }

    @Test
    void getBidsByAccountId_HappyPath() {
        when(bidRepos.findByPayment_Account_AccountId(any(Integer.class), any(Pageable.class))).thenReturn(Page.empty());
        assertNotNull(bidService.getBidsByAccountId(1, PageRequest.of(0, 1)));
    }

    @Test
    void createBid_HappyPath() {
        AuctionItem auctionItem = new AuctionItem();
        auctionItem.setAuctionItemId(new AuctionItemId(1,1));

        BidDTO bidDTO = new BidDTO();

        PaymentDTO paymentDTO = new PaymentDTO();
        paymentDTO.setAmount(BigDecimal.valueOf(100));
        paymentDTO.setAccountId(1);
        bidDTO.setPayment(paymentDTO);

        Bid bid = new Bid();
        bid.setBidId(1);
        bid.setPayment(new Payment());
        bid.setAuctionItem(auctionItem);
        bid.getPayment().setAccount(new Account());

        when(auctionItemRepos.findById(any())).thenReturn(Optional.of(auctionItem));
        when(accountRepos.findById(any())).thenReturn(Optional.of(new Account()));
        when(bidRepos.save(any())).thenReturn(bid);

        assertNotNull(bidService.createBid(bidDTO));
    }

    @Test
    void createBid_InvalidAuctionItemId() {
        when(auctionItemRepos.findById(any())).thenReturn(Optional.empty());

        BidDTO bidDTO = new BidDTO();
        PaymentDTO paymentDTO = new PaymentDTO();
        paymentDTO.setAmount(BigDecimal.valueOf(100));
        paymentDTO.setAccountId(1);
        bidDTO.setPayment(paymentDTO);

        assertThrows(IllegalArgumentException.class, () -> bidService.createBid(bidDTO));
    }

    @Test
    void createBid_InvalidAccountId() {
        when(auctionItemRepos.findById(any())).thenReturn(Optional.of(new AuctionItem()));
        when(accountRepos.findById(any())).thenReturn(Optional.empty());

        BidDTO bidDTO = new BidDTO();
        PaymentDTO paymentDTO = new PaymentDTO();
        paymentDTO.setAmount(BigDecimal.valueOf(100));
        paymentDTO.setAccountId(1);
        bidDTO.setPayment(paymentDTO);

        assertThrows(IllegalArgumentException.class, () -> bidService.createBid(bidDTO));
    }

    @Test
    void createBid_NullPayment() {
        BidDTO bidDTO = new BidDTO();

        assertThrows(IllegalArgumentException.class, () -> bidService.createBid(bidDTO));
    }

    @Test
    void getBidById_HappyPath() {
        AuctionItem auctionItem = new AuctionItem();
        auctionItem.setAuctionItemId(new AuctionItemId(1,1));

        BidDTO bidDTO = new BidDTO();

        PaymentDTO paymentDTO = new PaymentDTO();
        paymentDTO.setAmount(BigDecimal.valueOf(100));
        paymentDTO.setAccountId(1);
        bidDTO.setPayment(paymentDTO);

        Bid bid = new Bid();
        bid.setBidId(1);
        bid.setPayment(new Payment());
        bid.setAuctionItem(auctionItem);
        bid.getPayment().setAccount(new Account());
        when(bidRepos.findById(any())).thenReturn(Optional.of(bid));
        assertNotNull(bidService.getBidById(1));
    }

    @Test
    void getHighestBid_HappyPath() {
        when(auctionItemRepos.findById(any())).thenReturn(Optional.of(new AuctionItem()));
        when(bidRepos.findAllBidByAuctionItem_AuctionItemIdOrderByPayment_PaymentAmountDesc(any())).thenReturn(new ArrayList<>());
        assertNull(bidService.getHighestBid(new AuctionItemId()));
    }

    @Test
    void deleteBid_HappyPath() {
        when(bidRepos.findById(any())).thenReturn(Optional.of(new Bid()));
        assertDoesNotThrow(() -> bidService.deleteBid(1));
    }

    @Test
    void toBidResponse_HappyPath() {
        when(accountRepos.findById(any())).thenReturn(Optional.of(new Account()));
        assertNotNull(bidService.toBidResponse(new ArrayList<>()));
    }
}