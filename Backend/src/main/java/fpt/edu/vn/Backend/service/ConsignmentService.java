package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.ConsignmentDTO;
import fpt.edu.vn.Backend.DTO.ConsignmentDetailDTO;
import fpt.edu.vn.Backend.DTO.request.ConsignmentRequestDTO;
import fpt.edu.vn.Backend.DTO.request.UpdateConsignmentStatusRequestDTO;
import fpt.edu.vn.Backend.pojo.Attachment;
import fpt.edu.vn.Backend.pojo.Consignment;
import jakarta.validation.constraints.Null;
import org.jetbrains.annotations.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface ConsignmentService {
    // Create
    ConsignmentDTO requestConsignmentCreate(ConsignmentRequestDTO consignmentRequestDTO);

    // Evaluations
    ConsignmentDetailDTO submitInitialEvaluation(int consignmentId, String evaluation, BigDecimal price, int accountId);

    ConsignmentDetailDTO submitFinalEvaluationUpdate(int consignmentId, String evaluation, BigDecimal price, int accountId);

    // Status Updates
    void confirmJewelryReceived(int consignmentId);

    ConsignmentDTO approveFinalEvaluation(int consignmentId, int accountId, String description);

    ConsignmentDTO rejectFinalEvaluation(int consignmentId, int accountId, String rejectionReason);

    // General Updates
    void updateConsignment(int consignmentId, ConsignmentDTO updatedConsignment);
    void updateConsignmentByStatus(UpdateConsignmentStatusRequestDTO consignmentDTOList);
    // Reads
    ConsignmentDTO getConsignmentById(int id);

    default Page<ConsignmentDTO> getAllConsignments(String keyword,Pageable pageable) {
        return getAllConsignments(pageable, null, null, null, null, null, keyword);
    }

    Page<ConsignmentDTO> getAllStaffConsignments(int staffId, Pageable pageable);

    Page<ConsignmentDTO> getConsignmentsByStatus(String status, Pageable pageable, int accID);

    Page<ConsignmentDTO> getConsignmentsByUserId(int userId, Pageable pageable);

    Page<ConsignmentDetailDTO> getConsignmentDetail(int consignmentId);

    Page<ConsignmentDTO> getAllConsignments(Pageable pageable,
                                            @Nullable Consignment.Status status,
                                            @Nullable LocalDateTime from, @Nullable LocalDateTime to,
                                            @Nullable Integer customer,
                                            @Nullable Integer staff, @Nullable String search);

    //Customer
    ConsignmentDTO custAcceptInitialEvaluation(int consignmentId);

    ConsignmentDTO custRejectInitialEvaluation(int consignmentId);

    ConsignmentDTO custAcceptFinaltialEvaluation(int consignmentId);

    ConsignmentDTO custRejectFinaltialEvaluation(int consignmentId);

    // Delete (or Soft Delete)
    ResponseEntity<ConsignmentDTO> deleteConsignment(int id);

    ConsignmentDTO takeConsignment(int consignmentId, int accountId);

    ConsignmentDTO receivedConsignment(int consignmentId);

    void finishItem(Integer consignmentId, Integer itemId);

    ConsignmentDTO getConsignmentBySecretCode(String code);
}
