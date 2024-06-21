package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.DTO.AttachmentDTO;
import fpt.edu.vn.Backend.DTO.request.TwoFactorAuthChangeDTO;
import fpt.edu.vn.Backend.pojo.Account;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

public interface AccountService {
    @NotNull AccountDTO mapEntityToDTO(@NotNull Account account, @NotNull AccountDTO accountDTO);
    @NotNull default AccountDTO mapEntityToDTO(@NotNull Account account) {
        return mapEntityToDTO(account, new AccountDTO());
    }
    @NotNull Account mapDTOToEntity(@NotNull AccountDTO accountDTO, @NotNull Account account, @NotNull Account.Role editorRole);

    @NotNull Page<AccountDTO> getAccounts(@NotNull Pageable pageable);
    @NotNull Page<AccountDTO> getAccountsByRoles(@NotNull Pageable pageable, Set<Account.Role> roles);
    @NotNull Page<AccountDTO> getAccountsByNameOrEmail(@NotNull Pageable pageable, String name);

    @Nullable AccountDTO getAccountById(int accountId);
    @Nullable AccountDTO getAccountByEmail(@NotNull String email);
    @Nullable AccountDTO getAccountByEmailAndPassword(@NotNull String email, @NotNull String password);

    @NotNull AccountDTO createAccount(@NotNull AccountDTO account);
    @NotNull AccountDTO updateAccount(@NotNull AccountDTO account, @NotNull Account.Role editorRole);

    @NotNull AttachmentDTO setAvatar(int accountId, @NotNull MultipartFile file);
    void change2fa(int id, @NotNull TwoFactorAuthChangeDTO dto);
}