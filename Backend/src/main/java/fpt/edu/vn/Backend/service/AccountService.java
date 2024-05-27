package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.DTO.AttachmentDTO;
import fpt.edu.vn.Backend.pojo.Account;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface AccountService {
    Page<AccountDTO> getAllAccounts(@NotNull Pageable pageable);
    AccountDTO createAccount( AccountDTO account);
    AccountDTO getAccountById(int id);
    AccountDTO updateAccount(AccountDTO account);
    AccountDTO getAccountByEmail(String username);
    AccountDTO getAccountByEmailAndPassword(String email, String password);
    Account parseAccountDTOToEntity(AccountDTO accountDTO) ;

    AttachmentDTO addProfileImage(int id, MultipartFile file);

    void deactiveAccount(int id);

    void activeAccount(int id);
}
