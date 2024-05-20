package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.ConsignmentDTO;
import fpt.edu.vn.Backend.DTO.ConsignmentDetailDTO;
import fpt.edu.vn.Backend.pojo.Consignment;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.ConsignmentRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class ConsignmentServiceImpl implements ConsignmentService{

    ConsignmentRepos consignmentRepos;
    AccountRepos accountRepos;

@Autowired
    public ConsignmentServiceImpl(ConsignmentRepos consignmentRepos, AccountRepos accountRepos) {
        this.consignmentRepos = consignmentRepos;
        this.accountRepos = accountRepos;
    }

    @Override
    public ConsignmentDTO requestConsignmentCreate(Long userId, Long auctionItemId, ConsignmentDetailDTO consignmentDetails) {





        return null;
    }

    @Override
    public void submitInitialEvaluation(Long consignmentId, String evaluation, Long accountId) {

    }

    @Override
    public void submitFinalEvaluationUpdate(Long consignmentId, String evaluation, Long accountId) {

    }

    @Override
    public void confirmJewelryReceived(Long consignmentId) {

    }

    @Override
    public void approveFinalEvaluation(Long consignmentId) {

    }

    @Override
    public void rejectFinalEvaluation(Long consignmentId, String rejectionReason) {

    }

    @Override
    public void confirmAuctionParticipation(Long consignmentId) {

    }

    @Override
    public void assignAuctionSession(Long consignmentId, Long auctionSessionId) {

    }

    @Override
    public void updateConsignment(Long consignmentId, ConsignmentDTO updatedConsignment) {

    }

    @Override
    public ConsignmentDTO getConsignmentById(Long id) {
        return null;
    }

    @Override
    public List<ConsignmentDTO> getAllConsignments(int page, int size) {
        return List.of();
    }

    @Override
    public List<ConsignmentDTO> getConsignmentsByStatus(String status, int page, int size) {
        return List.of();
    }

    @Override
    public List<ConsignmentDTO> getConsignmentsByUserId(Long userId, int page, int size) {
        return List.of();
    }

    @Override
    public List<ConsignmentDetailDTO> getConsignmentDetail(Long consignmentId) {
        return List.of();
    }

    @Override
    public void deleteConsignment(Long id) {

    }
}
