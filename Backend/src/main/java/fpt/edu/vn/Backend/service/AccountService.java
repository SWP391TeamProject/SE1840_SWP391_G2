package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.AccountAdminDTO;
import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.pojo.Account;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

public interface AccountService {
    List<AccountAdminDTO> getAllAccounts(Pageable pageable);
    AccountDTO createAccount(AccountDTO account);
    AccountDTO getAccountById(int id);
    AccountDTO updateAccount(AccountDTO account);
    void deleteAccount(int id);
    AccountDTO getAccountByEmail(String username);
    AccountDTO getAccountByEmailAndPassword(String email, String password);
    Account parseAccountDTOToEntity(AccountDTO accountDTO) ;
}
