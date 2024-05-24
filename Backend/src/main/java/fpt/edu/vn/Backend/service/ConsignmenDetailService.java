package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.ConsignmentDetailDTO;

import java.util.List;

public interface ConsignmenDetailService {

    List<ConsignmentDetailDTO> getConsignmentsDetailByConsignmentId(int consignmentId);

    ConsignmentDetailDTO getConsignmentDetailById(int consignmentDetailId);

    ConsignmentDetailDTO createConsignmentDetail(ConsignmentDetailDTO consignmentDetail);

    ConsignmentDetailDTO updateConsignmentDetail(int consignmentDetailId, ConsignmentDetailDTO updatedConsignmentDetail);




}
