package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.DepositDTO;
import fpt.edu.vn.Backend.DTO.request.DepositRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface DepositService {
    DepositDTO createDeposit(DepositRequest depositRequest);
    DepositDTO getDepositById(int depositId);
    Page<DepositDTO> getAllDeposits(Pageable pageable);
    DepositDTO updateDeposit(DepositRequest depositRequest);
    void deleteDeposit(int depositId);
}
