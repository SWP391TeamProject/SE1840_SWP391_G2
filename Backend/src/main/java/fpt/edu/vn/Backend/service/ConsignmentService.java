package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.ConsignmentDTO;
import fpt.edu.vn.Backend.DTO.ConsignmentDetailDTO;
import fpt.edu.vn.Backend.repository.ConsignmentRepos;

import java.util.List;

public interface ConsignmentService {
    // Create
    ConsignmentDTO requestConsignmentCreate(Long userId, Long auctionItemId, ConsignmentDetailDTO consignmentDetails);

    // Evaluations
    void submitInitialEvaluation(Long consignmentId, String evaluation, Long accountId);
    void submitFinalEvaluationUpdate(Long consignmentId, String evaluation, Long accountId);

    // Status Updates
    void confirmJewelryReceived(Long consignmentId);
    void approveFinalEvaluation(Long consignmentId);
    void rejectFinalEvaluation(Long consignmentId, String rejectionReason);
    void confirmAuctionParticipation(Long consignmentId);
    void assignAuctionSession(Long consignmentId, Long auctionSessionId);

    // General Updates
    void updateConsignment(Long consignmentId, ConsignmentDTO updatedConsignment);

    // Reads
    ConsignmentDTO getConsignmentById(Long id);
    List<ConsignmentDTO> getAllConsignments(int page, int size);
    List<ConsignmentDTO> getConsignmentsByStatus(String status, int page, int size);
    List<ConsignmentDTO> getConsignmentsByUserId(Long userId, int page, int size);
    List<ConsignmentDetailDTO> getConsignmentDetail(Long consignmentId);

    // Delete (or Soft Delete)
    void deleteConsignment(Long id);
}
