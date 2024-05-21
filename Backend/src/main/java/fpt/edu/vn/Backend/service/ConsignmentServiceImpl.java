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
        try {
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
        } catch (Exception e) {
            throw new ConsignmentServiceException("Error submitting initial evaluation");
        }
    }

    @Override
    public void submitFinalEvaluationUpdate(int consignmentId, String evaluation, BigDecimal price, int accountId, List<Attachment> attachments) {

    try {
        consignmentRepos.findById(consignmentId).ifPresent(consignment -> {
            if (consignment.getConsignmentDetails().stream().noneMatch(detail ->
                    detail.getType().equals(ConsignmentDetail.ConsignmentStatus.INITIAL_EVALUATION))) {
                throw new ConsignmentServiceException("Initial Evaluation not submitted");
            }
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
    } catch (Exception e) {
        throw new ConsignmentServiceException("Error submitting final evaluation");
    }


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
        Consignment consignment= consignmentRepos.findById(consignmentId).orElseThrow();
        List<ConsignmentDetailDTO> consignmentDetailDTOs = new java.util.ArrayList<>();
        for(ConsignmentDetail detail: consignment.getConsignmentDetails()){
            consignmentDetailDTOs.add(ConsignmentDetailDTO.builder()
                    .consignmentDetailId(detail.getConsignmentDetailId())
                    .description(detail.getDescription())
                    .type(detail.getType().toString())
                    .price(detail.getPrice())
                    .consignmentId(detail.getConsignment().getConsignmentId())
                    .accountId(detail.getAccount().getAccountId())
                    .attachmentIds(List.of(detail.getAttachments().stream().map(Attachment::getAttachmentId).toArray(Integer[]::new)))
                    .build());
        }
        return consignmentDetailDTOs;
    }

    @Override
    public void deleteConsignment(int id) {

    }
}