package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.ConsignmentDTO;
import fpt.edu.vn.Backend.DTO.ConsignmentDetailDTO;
import fpt.edu.vn.Backend.pojo.Attachment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.List;

public interface ConsignmentService {
    // Create
    ConsignmentDTO requestConsignmentCreate(int userId, String preferContact, ConsignmentDetailDTO consignmentDetails);

    // Evaluations
    ConsignmentDetailDTO submitInitialEvaluation(int consignmentId, String evaluation, BigDecimal price, int accountId);
    ConsignmentDetailDTO submitFinalEvaluationUpdate(int consignmentId, String evaluation, BigDecimal price, int accountId);

    // Status Updates
    void confirmJewelryReceived(int consignmentId);
    void approveFinalEvaluation(int consignmentId, int accountId,String description);
    void rejectFinalEvaluation(int consignmentId,int accountId, String rejectionReason);

    // General Updates
    void updateConsignment(int consignmentId, ConsignmentDTO updatedConsignment);

    // Reads
    ConsignmentDTO getConsignmentById(int id);
    Page<ConsignmentDTO> getAllConsignments(Pageable pageable);
    Page<ConsignmentDTO> getConsignmentsByStatus(String status, int page, int size,int accID);
    Page<ConsignmentDTO> getConsignmentsByUserId(int userId, int page, int size);
    Page<ConsignmentDetailDTO> getConsignmentDetail(int consignmentId);

    //Customer
    ConsignmentDTO custAcceptInitialEvaluation(int consignmentId);
    ConsignmentDTO custRejectInitialEvaluation(int consignmentId);
    ConsignmentDTO custAcceptFinaltialEvaluation(int consignmentId);
    ConsignmentDTO custRejectFinaltialEvaluation(int consignmentId);

    // Delete (or Soft Delete)
    ResponseEntity<ConsignmentDTO> deleteConsignment(int id);

    ConsignmentDTO takeConsignment(int consignmentId, int accountId);
    ConsignmentDTO receivedConsignment(int consignmentId);
}
