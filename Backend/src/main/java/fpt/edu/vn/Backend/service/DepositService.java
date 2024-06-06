package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.DepositDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface DepositService {
    DepositDTO createDeposit(DepositDTO depositDTO);
    DepositDTO getDepositById(int depositId);
    Page<DepositDTO> getAllDeposits(Pageable pageable);
    DepositDTO updateDeposit(int depositId, DepositDTO depositDTO);
    void deleteDeposit(int depositId);
}
