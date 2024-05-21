package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.ConsignmentDTO;
import fpt.edu.vn.Backend.DTO.ConsignmentDetailDTO;
import fpt.edu.vn.Backend.pojo.Attachment;
import fpt.edu.vn.Backend.repository.ConsignmentRepos;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

public interface ConsignmentService {
    // Create
    ConsignmentDTO requestConsignmentCreate(int userId, int auctionItemId, ConsignmentDetailDTO consignmentDetails);

    // Evaluations
    void submitInitialEvaluation(int consignmentId, String evaluation, BigDecimal price, int accountId, List<Attachment> attachments);
    void submitFinalEvaluationUpdate(int consignmentId, String evaluation, BigDecimal price, int accountId, List<Attachment> attachments);

    // Status Updates
    void confirmJewelryReceived(int consignmentId);
    void approveFinalEvaluation(int consignmentId);
    void rejectFinalEvaluation(int consignmentId, String rejectionReason);

    void confirmAuctionParticipation(int consignmentId);
    void assignAuctionSession(int consignmentId, int auctionSessionId);

    // General Updates
    void updateConsignment(int consignmentId, ConsignmentDTO updatedConsignment);

    // Reads
    ConsignmentDTO getConsignmentById(int id);
    List<ConsignmentDTO> getAllConsignments(int page, int size);
    List<ConsignmentDTO> getConsignmentsByStatus(String status, int page, int size);
    List<ConsignmentDTO> getConsignmentsByUserId(int userId, int page, int size);
    List<ConsignmentDetailDTO> getConsignmentDetail(int consignmentId);

    // Delete (or Soft Delete)
    void deleteConsignment(int id);
}
