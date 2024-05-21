package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.ConsignmentDTO;
import fpt.edu.vn.Backend.DTO.ConsignmentDetailDTO;
import fpt.edu.vn.Backend.exception.ConsignmentServiceException;
import fpt.edu.vn.Backend.pojo.Attachment;
import fpt.edu.vn.Backend.pojo.Consignment;
import fpt.edu.vn.Backend.pojo.ConsignmentDetail;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.ConsignmentRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

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
    public ConsignmentDTO requestConsignmentCreate(int userId, int auctionItemId, ConsignmentDetailDTO consignmentDetails) {





        return null;
    }

    @Override
    public void submitInitialEvaluation(int consignmentId, String evaluation, BigDecimal price, int accountId, List<Attachment> attachments) {
        consignmentRepos.findById(consignmentId).ifPresent(consignment -> {
            if (consignment.getConsignmentDetails().stream().anyMatch(detail ->
                    detail.getType().equals(ConsignmentDetail.ConsignmentStatus.INITIAL_EVALUATION))) {
                throw new ConsignmentServiceException("Initial Evaluation already submitted");
            }
            ConsignmentDetail detail = new ConsignmentDetail();
            detail.setType(ConsignmentDetail.ConsignmentStatus.INITIAL_EVALUATION);
            detail.setAccount(accountRepos.findById(accountId).orElseThrow());
            detail.setPrice(price);
            detail.setDescription(evaluation);
            detail.setAttachments(attachments);
            consignment.getConsignmentDetails().add(detail);
            consignmentRepos.save(consignment);
        });
    }

    @Override
    public void submitFinalEvaluationUpdate(int consignmentId, String evaluation, BigDecimal price, int accountId, List<Attachment> attachments) {
        consignmentRepos.findById(consignmentId).ifPresent(consignment -> {
            if (consignment.getConsignmentDetails().stream().anyMatch(detail ->
                    detail.getType().equals(ConsignmentDetail.ConsignmentStatus.FINAL_EVALUATION))) {
                throw new ConsignmentServiceException("Final Evaluation already submitted");
            }
            ConsignmentDetail detail = new ConsignmentDetail();
            detail.setType(ConsignmentDetail.ConsignmentStatus.FINAL_EVALUATION);
            detail.setAccount(accountRepos.findById(accountId).orElseThrow());
            detail.setPrice(price);
            detail.setDescription(evaluation);
            detail.setAttachments(attachments);
            consignment.getConsignmentDetails().add(detail);
            consignmentRepos.save(consignment);
        });

    }

    @Override
    public void confirmJewelryReceived(int consignmentId) {

    }

    @Override
    public void approveFinalEvaluation(int consignmentId) {

    }

    @Override
    public void rejectFinalEvaluation(int consignmentId, String rejectionReason) {

    }

    @Override
    public void confirmAuctionParticipation(int consignmentId) {

    }

    @Override
    public void assignAuctionSession(int consignmentId, int auctionSessionId) {

    }

    @Override
    public void updateConsignment(int consignmentId, ConsignmentDTO updatedConsignment) {

    }

    @Override
    public ConsignmentDTO getConsignmentById(int id) {
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
    public List<ConsignmentDTO> getConsignmentsByUserId(int userId, int page, int size) {
        return List.of();
    }

    @Override
    public List<ConsignmentDetailDTO> getConsignmentDetail(int consignmentId) {
        return List.of();
    }

    @Override
    public void deleteConsignment(int id) {

    }
}
