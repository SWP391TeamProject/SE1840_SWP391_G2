package fpt.edu.vn.Backend.service;

import com.google.common.base.Preconditions;
import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.DTO.AttachmentDTO;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.repository.AccountRepos;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Set;

@Service
public class AccountServiceImpl implements AccountService {
    private static final Logger logger = LoggerFactory.getLogger(AccountServiceImpl.class);
    private final AccountRepos accountRepos;
    private final AttachmentServiceImpl attachmentServiceImpl;

    @Autowired
    public AccountServiceImpl(AccountRepos accountRepos, AttachmentServiceImpl attachmentServiceImpl) {
        this.accountRepos = accountRepos;
        this.attachmentServiceImpl = attachmentServiceImpl;
    }

    @Override
    public @NotNull AccountDTO mapEntityToDTO(@NotNull Account account, @NotNull AccountDTO accountDTO) {
        accountDTO.setAccountId(account.getAccountId());
        accountDTO.setNickname(account.getNickname());
        var avatar = account.getAvatarUrl();
        if (avatar != null)
            accountDTO.setAvatar(attachmentServiceImpl.mapEntityToDTO(avatar));
        if (account.getRole() != null)
            accountDTO.setRole(account.getRole());
        accountDTO.setEmail(account.getEmail());
        accountDTO.setPhone(account.getPhone());
        accountDTO.setStatus(account.getStatus());
        accountDTO.setBalance(account.getBalance());
        // accountDTO.setPassword(account.getPassword()); // DO NOT RETURN PASSWORD
        accountDTO.setCreateDate(account.getCreateDate());
        accountDTO.setUpdateDate(account.getUpdateDate());
        return accountDTO;
    }

    @Override
    public @NotNull Account mapDTOToEntity(@NotNull AccountDTO accountDTO, @NotNull Account account) {
        // avatar dùng method riêng
        // không set toàn bộ tránh exploit
        account.setAccountId(accountDTO.getAccountId());
        if (accountDTO.getRole() != null && !String.valueOf(accountDTO.getRole()).isEmpty())
            account.setRole(accountDTO.getRole());
        if (accountDTO.getNickname() != null)
            account.setNickname(accountDTO.getNickname());
        if (accountDTO.getPhone() != null)
            account.setPhone(accountDTO.getPhone());
        if (accountDTO.getStatus() != null)
            account.setStatus(accountDTO.getStatus());
        if (accountDTO.getBalance() != null)
            account.setBalance(accountDTO.getBalance());
        return account;
    }

    @Override
    public @NotNull Page<AccountDTO> getAccounts(@NotNull Pageable pageable) {
        return accountRepos.findAll(pageable).map(this::mapEntityToDTO);
    }

    @Override
    public @NotNull Page<AccountDTO> getAccountsByRoles(@NotNull Pageable pageable, Set<Account.Role> roles) {
        var a = accountRepos.findByRoleIn(roles, pageable);
        a = a == null ? Page.empty(pageable) : a;
        return a.map(this::mapEntityToDTO);
    }

    @Override
    public @Nullable AccountDTO getAccountById(int accountId) {
        return accountRepos.findById(accountId).map(this::mapEntityToDTO).orElse(null);
    }

    @Override
    public @Nullable AccountDTO getAccountByEmail(@NotNull String email) {
        return accountRepos.findByEmail(email).map(this::mapEntityToDTO).orElse(null);
    }

    @Override
    public @Nullable AccountDTO getAccountByEmailAndPassword(@NotNull String email, @NotNull String password) {
        return accountRepos.findByEmailAndPassword(email, password).map(this::mapEntityToDTO).orElse(null);
    }

    @Override
    public @NotNull AccountDTO createAccount(@NotNull AccountDTO account) {
        Account a = new Account();
        // avatar dùng method riêng
        // không set trực tiếp từ DTO tránh exploit
        a.setNickname(account.getNickname());
        a.setRole(account.getRole());
        a.setEmail(account.getEmail());
        a.setPhone(account.getPhone());
        a.setStatus(Account.Status.ACTIVE);
        a.setPassword(account.getPassword());
        return mapEntityToDTO(accountRepos.save(a));
    }

    @Override
    public @NotNull AccountDTO updateAccount(@NotNull AccountDTO account) {
        Preconditions.checkNotNull(account.getAccountId(), "Account is not identifiable");
        Account acc = accountRepos.findById(account.getAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("Account", "accountId", account.getAccountId()));
        return mapEntityToDTO(accountRepos.save(mapDTOToEntity(account, acc)));
    }

    @Override
    public @NotNull AttachmentDTO setAvatar(int accountId, @NotNull MultipartFile file) {
        try {
            return attachmentServiceImpl.uploadAccountAttachment(file, accountId);
        } catch (IOException e) {
            throw new ResourceNotFoundException("Account", "accountId", accountId);
        }
    }
}