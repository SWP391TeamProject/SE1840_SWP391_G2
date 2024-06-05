package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.DepositDTO;
import fpt.edu.vn.Backend.pojo.AuctionItem;
import fpt.edu.vn.Backend.pojo.Deposit;
import fpt.edu.vn.Backend.pojo.Payment;
import fpt.edu.vn.Backend.repository.AuctionItemRepos;
import fpt.edu.vn.Backend.repository.DepositRepos;
import fpt.edu.vn.Backend.repository.PaymentRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DepositServiceImpl implements DepositService{
    @Autowired
    private DepositRepos depositRepos;
    @Autowired
    private AuctionItemRepos auctionItemRepos;
    @Autowired
    private PaymentRepos paymentRepos;


    @Override
    public DepositDTO createDeposit(DepositDTO depositDTO) {
        try {
            Deposit deposit = new Deposit();
            Optional<AuctionItem> auctionItemOptional = auctionItemRepos.findById(depositDTO.getAuctionItemId());
            if (auctionItemOptional.isPresent()) {
                deposit.setAuctionItem(auctionItemOptional.get());
            } else {
                throw new RuntimeException("Auction Item not found");
            }
            int paymentId = depositDTO.getPayment().getId();
            Optional<Payment> paymentOptional = paymentRepos.findById(paymentId);
            if (paymentOptional.isPresent()) {
                deposit.setPayment(paymentOptional.get());
            } else {
                throw new RuntimeException("Payment not found");
            }

            deposit = depositRepos.save(deposit);
            return new DepositDTO(deposit);
        } catch (Exception ex) {
            throw new RuntimeException("Failed to create deposit: " + ex.getMessage());
        }
    }

    @Override
    public DepositDTO getDepositById(int depositId) {
        try {
            Deposit deposit = depositRepos.findById(depositId)
                    .orElseThrow(() -> new RuntimeException("Deposit not found"));
            return new DepositDTO(deposit);
        } catch (Exception ex) {
            throw new RuntimeException("Failed to retrieve deposit: " + ex.getMessage());
        }
    }

    @Override
    public Page<DepositDTO> getAllDeposits(Pageable pageable) {
        try {
            Page<Deposit> deposits = depositRepos.findAll(pageable);
            return deposits.map(DepositDTO::new);
        } catch (Exception ex) {
            throw new RuntimeException("Failed to retrieve deposits: " + ex.getMessage());
        }
    }

    @Override
    public DepositDTO updateDeposit(int depositId, DepositDTO depositDTO) {
        try {
            Deposit deposit = depositRepos.findById(depositId)
                    .orElseThrow(() -> new RuntimeException("Deposit not found"));

            Optional<AuctionItem> auctionItemOptional = auctionItemRepos.findById(depositDTO.getAuctionItemId());
            if (auctionItemOptional.isPresent()) {
                deposit.setAuctionItem(auctionItemOptional.get());
            } else {
                throw new RuntimeException("Auction Item not found");
            }
            int paymentId = depositDTO.getPayment().getId();
            Optional<Payment> paymentOptional = paymentRepos.findById(paymentId);
            if (paymentOptional.isPresent()) {
                deposit.setPayment(paymentOptional.get());
            } else {
                throw new RuntimeException("Payment not found");
            }

            deposit = depositRepos.save(deposit);
            return new DepositDTO(deposit);
        } catch (Exception ex) {
            throw new RuntimeException("Failed to update deposit: " + ex.getMessage());
        }
    }

    @Override
    public void deleteDeposit(int depositId) {
        try {
            Deposit deposit = depositRepos.findById(depositId)
                    .orElseThrow(() -> new RuntimeException("Deposit not found"));
            depositRepos.delete(deposit);
        } catch (Exception ex) {
            throw new RuntimeException("Failed to delete deposit: " + ex.getMessage());
        }
    }
}

