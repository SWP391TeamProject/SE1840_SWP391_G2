package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.DTO.AttachmentDTO;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.Role;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.RoleRepos;
import jakarta.annotation.security.RolesAllowed;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountServiceImpl implements AccountService {
    private static final Logger log = LoggerFactory.getLogger(AccountServiceImpl.class);
    private final AccountRepos accountRepos;

    private final RoleRepos roleRepos;
    private final AttachmentServiceImpl attachmentServiceImpl;

    @Autowired
    public AccountServiceImpl(AccountRepos accountRepos, RoleRepos roleRepos, AttachmentServiceImpl attachmentServiceImpl) {
        this.accountRepos = accountRepos;
        this.roleRepos = roleRepos;
        this.attachmentServiceImpl = attachmentServiceImpl;
    }

    @Override
    public Page<AccountDTO> getAllAccounts(Pageable pageable) {
        Page<Account> accounts = accountRepos.findAll(pageable);
        return accounts.map(AccountDTO::new);
    }

    @Override
    public AccountDTO createAccount(AccountDTO accountDTO) {
        Account account = new Account();
        account.setNickname(accountDTO.getNickname());
        account.setEmail(accountDTO.getEmail());
        account.setPhone(accountDTO.getPhone());
        account.setBalance(accountDTO.getBalance());
        account.setCreateDate(accountDTO.getCreateDate());
        account.setUpdateDate(accountDTO.getUpdateDate());
        account.setAuthorities(accountDTO.getRole().stream().map(roleDTO -> {
            Role role;
            role = roleRepos.findById(roleDTO.getRoleId()).orElseThrow(() -> new ResourceNotFoundException("Role", "roleId", ""+roleDTO.getRoleId()));
            return role;
        }).collect(Collectors.toSet()));
        return new AccountDTO(accountRepos.save(account));

    }



    @Override
    public AccountDTO getAccountById(int id) {
        return accountRepos.findById(id)
                .map(AccountDTO::new)
                .orElse(null);
    }

    @Override
    public AccountDTO updateAccount(AccountDTO accountDTO) {
        Account account = accountRepos.findById(accountDTO.getAccountId()).orElseThrow(() -> new ResourceNotFoundException("Account", "accountId", ""+accountDTO.getAccountId()));
        account.setNickname(accountDTO.getNickname());
        account.setEmail(accountDTO.getEmail());
        account.setPhone(accountDTO.getPhone());
        account.setBalance(accountDTO.getBalance());
        account.setCreateDate(accountDTO.getCreateDate());
        account.setUpdateDate(LocalDateTime.now());
        account.setStatus(accountDTO.getStatus());
        account.setAuthorities(accountDTO.getRole().stream().map(roleDTO -> {
            Role role;
            role = roleRepos.findById(roleDTO.getRoleId()).orElseThrow(() -> new ResourceNotFoundException("Role", "roleDTO", ""+roleDTO.getRoleId()));
            return role;
        }).collect(Collectors.toSet()));
        return new AccountDTO(accountRepos.save(account));

    }




    @Override
    public AccountDTO getAccountByEmail(String email) {
        return new AccountDTO(accountRepos.findAll().stream().filter(
                account -> account.getEmail().equals(email)).findFirst().orElseThrow(
                        () -> new ResourceNotFoundException("Account", "email", email)));
    }

    @Override
    public AccountDTO getAccountByEmailAndPassword(String email, String password) {
        return new AccountDTO(accountRepos.findAll().stream().filter(
                account -> account.getEmail().equals(email) && account.getPassword().equals(password)).findFirst().orElseThrow(
                        () -> new ResourceNotFoundException("Account", "email", email))) ;
    }

    @Override
    public Account parseAccountDTOToEntity(AccountDTO accountDTO) {
        Account account = new Account();
        account.setAccountId(accountDTO.getAccountId());
        account.setNickname(accountDTO.getNickname());
        account.setEmail(accountDTO.getEmail());
        account.setPhone(accountDTO.getPhone());
        account.setBalance(accountDTO.getBalance());
        account.setCreateDate(accountDTO.getCreateDate());
        account.setUpdateDate(accountDTO.getUpdateDate());
        account.setAuthorities(accountDTO.getRole().stream().map(roleDTO -> {
            Role role;
            role = roleRepos.findById(roleDTO.getRoleId()).orElseThrow(() -> new ResourceNotFoundException("Role", "roleDTO", ""+roleDTO.getRoleId()));
            return role;
        }).collect(Collectors.toSet()));
        return account;
    }

    @Override
    public AttachmentDTO setAvatar(int id, @NotNull MultipartFile file) {
        try {
            return attachmentServiceImpl.uploadAccountAttachment(file, id);
        } catch (IOException e) {
            throw new ResourceNotFoundException("Account", "accountId", ""+id);
            // Handle the exception appropriately
        }
    }

    @Override
    public void activateAccount(int accountId) {
        AccountDTO account = accountRepos.findById(accountId).map(AccountDTO::new).orElseThrow(() -> new ResourceNotFoundException("Account", "accountId", ""+accountId));
        account.setAccountId(accountId);
        account.setStatus((byte) 1);
        updateAccount(account);
    }

    @Override
    public void deactivateAccount(int accountId) {
        
        AccountDTO account = new AccountDTO();
        account.setAccountId(accountId);
        account.setStatus((byte) 0);
        updateAccount(account);
    }
}
