package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.ConsignmentDTO;
import fpt.edu.vn.Backend.DTO.ConsignmentDetailDTO;
import fpt.edu.vn.Backend.pojo.Attachment;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.List;

public interface ConsignmentService {
    // Create
    ConsignmentDTO requestConsignmentCreate(int userId, String preferContact, ConsignmentDetailDTO consignmentDetails);

    // Evaluations
    void submitInitialEvaluation(int consignmentId, String evaluation, BigDecimal price, int accountId, List<Attachment> attachments);
    void submitFinalEvaluationUpdate(int consignmentId, String evaluation, BigDecimal price, int accountId, List<Attachment> attachments);

    // Status Updates
    void confirmJewelryReceived(int consignmentId);
    void approveFinalEvaluation(int consignmentId, int accountId,String description);
    void rejectFinalEvaluation(int consignmentId,int accountId, String rejectionReason);

    void confirmAuctionParticipation(int consignmentId);
    void assignAuctionSession(int consignmentId, int auctionSessionId);

    // General Updates
    void updateConsignment(int consignmentId, ConsignmentDTO updatedConsignment);

    // Reads
    ConsignmentDTO getConsignmentById(int id);
    Page<ConsignmentDTO> getAllConsignments(int page, int size);
    Page<ConsignmentDTO> getConsignmentsByStatus(String status, int page, int size);
    Page<ConsignmentDTO> getConsignmentsByUserId(int userId, int page, int size);
    Page<ConsignmentDetailDTO> getConsignmentDetail(int consignmentId);

    // Delete (or Soft Delete)
    ResponseEntity<ConsignmentDTO> deleteConsignment(int id);
}
