package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.ConsignmentDetailDTO;
import fpt.edu.vn.Backend.DTO.request.ConsignmentDetailRequestDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ConsignmentDetailService {

    Page<ConsignmentDetailDTO> getAllConsignmentsDetail(Pageable pageable);

    List<ConsignmentDetailDTO> getConsignmentsDetailByConsignmentId(int consignmentId);

    ConsignmentDetailDTO getConsignmentDetailById(int consignmentDetailId);

    ConsignmentDetailDTO createConsignmentDetail(ConsignmentDetailRequestDTO consignmentRequestDetailDTO);

    ConsignmentDetailDTO updateConsignmentDetail(int consignmentDetailId, ConsignmentDetailRequestDTO consignmentRequestDetailDTO);




}
