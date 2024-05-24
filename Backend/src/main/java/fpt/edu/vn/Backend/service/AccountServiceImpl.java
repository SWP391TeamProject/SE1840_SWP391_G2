package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.AccountAdminDTO;

import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.Role;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.RoleRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountServiceImpl implements AccountService {
    @Autowired
    private AccountRepos accountRepos;

    @Autowired
    private RoleRepos roleRepos;
    public AccountServiceImpl(AccountRepos accountRepos) {
        this.accountRepos = accountRepos;
    }

    @Override
    public Page<AccountAdminDTO> getAllAccounts(Pageable pageable) {
        Page<Account> accounts = accountRepos.findAll(pageable);
        List<AccountAdminDTO> dtos = accounts.stream()
                .map(account -> {
                    AccountAdminDTO dto = new AccountAdminDTO();
                    dto.setUserId(account.getAccountId());
                    dto.setNickname(account.getNickname());
                    dto.setRole(account.getAuthorities().stream()
                            .map(Role::getRoleId)
                            .collect(Collectors.toList()));
                    dto.setEmail(account.getEmail());
                    dto.setPhone(account.getPhone());
                    dto.setBalance(account.getBalance());
                    dto.setCreateDate(account.getCreateDate());
                    dto.setUpdateDate(account.getUpdateDate());
                    return dto;
                })
                .collect(Collectors.toList());
        return new PageImpl<>(dtos, pageable, accounts.getTotalElements());
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
        account.setAuthorities(accountDTO.getRole().stream().map(roleId -> {
            Role role = new Role();
            role = roleRepos.findById(roleId).orElseThrow(() -> new ResourceNotFoundException("Role", "roleId", ""+roleId));
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
        account.setUpdateDate(accountDTO.getUpdateDate());
        account.setAuthorities(accountDTO.getRole().stream().map(roleId -> {
            Role role;
            role = roleRepos.findById(roleId).orElseThrow(() -> new ResourceNotFoundException("Role", "roleId", ""+roleId));
            return role;
        }).collect(Collectors.toSet()));
        return new AccountDTO(accountRepos.save(account));

    }



    @Override
    public void deactiveAccount(int id) {

    }

    @Override
    public void activeAccount(int id) {

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
        account.setAuthorities(accountDTO.getRole().stream().map(roleId -> {
            Role role;
            role = roleRepos.findById(roleId).orElseThrow(() -> new ResourceNotFoundException("Role", "roleId", ""+roleId));
            return role;
        }).collect(Collectors.toSet()));
        return account;
    }
}
