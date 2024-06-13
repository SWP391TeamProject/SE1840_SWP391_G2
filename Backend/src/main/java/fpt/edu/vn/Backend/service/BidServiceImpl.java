package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.DTO.BidDTO;
import fpt.edu.vn.Backend.DTO.PaymentDTO;
import fpt.edu.vn.Backend.DTO.response.BidResponse;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.AuctionItem;
import fpt.edu.vn.Backend.pojo.AuctionItemId;
import fpt.edu.vn.Backend.pojo.Bid;
import fpt.edu.vn.Backend.pojo.Payment;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.BidRepos;
import fpt.edu.vn.Backend.repository.AuctionItemRepos;
import fpt.edu.vn.Backend.repository.PaymentRepos;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BidServiceImpl implements BidService {

    private static final Logger log = LoggerFactory.getLogger(BidServiceImpl.class);

    @Autowired
    private BidRepos bidRepos;

    @Autowired
    private AuctionItemRepos auctionItemRepos;
    @Autowired
    private PaymentRepos paymentRepos;
    @Autowired
    private PaymentService paymentService;
    @Autowired
    private AccountRepos accountRepos;


    @Override
    public List<BidDTO> getAllBids() {
        return
                bidRepos.findAll().stream().map(
                        BidDTO::new).toList();
    }

    @Override
    public List<BidDTO> getBidsByAuctionItemId(AuctionItemId auctionItemId) {
        try {
            return bidRepos.findAllBidByAuctionItem_AuctionItemIdOrderByPayment_PaymentAmountDesc(auctionItemId).stream().map(BidDTO::new).toList();
        }catch (Exception e){
            throw new ResourceNotFoundException("Invalid auction item id: " + auctionItemId);
        }
    }

    @Override
    public Page<BidDTO> getBidsByAccountId(int id, Pageable pageable) {
        try {
            return bidRepos.findByPayment_Account_AccountId(id, pageable).map(BidDTO::new);
        }catch (Exception e){
            throw new ResourceNotFoundException("Invalid account id: " + id);
        }

    }

    @Override
    public BidDTO createBid(BidDTO bid) {
        Bid newBid = new Bid();
        newBid.setBidId(bid.getBidId());
        AuctionItem auctionItem = auctionItemRepos.findById(bid.getAuctionItemId()).orElseThrow(
                () -> new IllegalArgumentException("Invalid auction item id: " + bid.getAuctionItemId())
        );
        newBid.setAuctionItem(auctionItem);
        PaymentDTO paymentDTO = bid.getPayment();
        if (paymentDTO == null) {
            throw new IllegalArgumentException("Payment cannot be null");
        }
        paymentDTO.setType(Payment.Type.AUCTION_BID);
        paymentDTO.setAmount(bid.getPayment().getAmount());
        paymentDTO.setAccountId(bid.getPayment().getAccountId());
        paymentDTO.setStatus(Payment.Status.PENDING);
        Payment newPayment = new Payment();
        newPayment.setPaymentAmount(paymentDTO.getAmount());
        newPayment.setCreateDate(paymentDTO.getDate());
        newPayment.setType(paymentDTO.getType());
        newPayment.setStatus(paymentDTO.getStatus());
        newPayment.setAccount(accountRepos.findById(paymentDTO.getAccountId()).orElseThrow(
                () -> new IllegalArgumentException("Invalid account id: " + bid.getPayment().getAccountId())
        ));
        newBid.setPayment(newPayment);
        newPayment.setBid(newBid);
        return new BidDTO(bidRepos.save(newBid));
    }

    @Override
    public BidDTO getBidById(int id) {
        return new BidDTO(bidRepos.findById(id).orElseThrow(
                () -> new IllegalArgumentException("Invalid bid id: " + id)
        ));
    }

    @Override
    public BidDTO getHighestBid(AuctionItemId auctionItemId) {
        // This method requires a custom query to be implemented in the repository
        auctionItemRepos.findById(auctionItemId).orElseThrow(
                () -> new IllegalArgumentException("Invalid auction item id: " + auctionItemId)
        );
        List<Bid> bids = bidRepos.findAllBidByAuctionItem_AuctionItemIdOrderByPayment_PaymentAmountDesc(auctionItemId);
        if(bids.isEmpty()) return null;
        return new BidDTO(bids.get(0));
    }

    @Override
    public void deleteBid(int id) {
        bidRepos.findById(id).orElseThrow(
                () -> new IllegalArgumentException("Invalid bid id: " + id)
        );
        bidRepos.deleteById(id);
    }

    @Override
    public List<BidDTO> finishAuctionItem(AuctionItemId auctionItemId) {
        List<Bid> bids = bidRepos.findAllBidByAuctionItem_AuctionItemIdOrderByPayment_PaymentAmountDesc(auctionItemId);
        List<BidDTO> result = new ArrayList<>();
        for (Bid bid : bids) {
            if (bids.get(0).equals(bid)){
                result.add(new BidDTO(bid));
                continue;
            }
            log.info("Bid " + bid.getBidId() + " failed");
            Payment payment = bid.getPayment();
            payment.setStatus(Payment.Status.FAILED);
            paymentRepos.save(payment);
            result.add(new BidDTO(bid));
        }
        return result;
    }

    @Override
    public List<BidResponse> toBidResponse(List<BidDTO> bids) {
        List<BidResponse> responses = new ArrayList<>();
        for (BidDTO bid : bids) {
            BidResponse response = new BidResponse();
            response.setBidId(bid.getBidId());
            response.setAccount(new AccountDTO(accountRepos.findById(bid.getPayment().getAccountId()).orElseThrow(
                    () -> new IllegalArgumentException("Invalid account id: " + bid.getPayment().getAccountId())
            )));
            response.getAccount().setPassword(null);
            response.setPrice(Double.parseDouble(bid.getPayment().getAmount().toString()));
            responses.add(response);
        }
        return responses;
    }

}