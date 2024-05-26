package fpt.edu.vn.Backend.service;


import fpt.edu.vn.Backend.DTO.ConsignmentDetailDTO;

import java.util.List;

public class ConsignmentDetailServiceImpl implements ConsignmenDetailService{

    @Override
    public List<ConsignmentDetailDTO> getConsignmentsDetailByConsignmentId(int consignmentId) {
        return List.of();
    }

    @Override
    public ConsignmentDetailDTO getConsignmentDetailById(int consignmentDetailId) {
        return null;
    }

    @Override
    public ConsignmentDetailDTO createConsignmentDetail(ConsignmentDetailDTO consignmentDetail) {
        return null;
    }

    @Override
    public ConsignmentDetailDTO updateConsignmentDetail(int consignmentDetailId, ConsignmentDetailDTO updatedConsignmentDetail) {
        return null;
    }
}
