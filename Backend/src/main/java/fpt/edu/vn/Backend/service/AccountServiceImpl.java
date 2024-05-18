package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.dto.AccountAdminDTO;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.repository.AccountRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountServiceImpl implements AccountService{
    @Autowired
    private AccountRepos accountRepos;

    public AccountServiceImpl(AccountRepos accountRepos) {
        this.accountRepos = accountRepos;
    }

    @Override
    public List<AccountAdminDTO> getAllAccounts(Pageable pageable) {
        List<Account> accounts = accountRepos.findAll(pageable).getContent();
        return accounts.stream()
                .map(account -> {
                    AccountAdminDTO dto = new AccountAdminDTO();
                    dto.setUserId(account.getUserId());
                    dto.setNickname(account.getNickname());
                    dto.setRole(account.getRole());
                    dto.setEmail(account.getEmail());
                    dto.setPhone(account.getPhone());
                    dto.setBalance(account.getBalance());
                    dto.setCreateDate(account.getCreateDate());
                    dto.setUpdateDate(account.getUpdateDate());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public Account createAccount(Account account) {
        return accountRepos.save(account);
    }

    @Override
    public Account getAccountById(int id) {
        return accountRepos.findById(id).orElse(null);
    }

    @Override
    public Account updateAccount(Account account) {
        return null;
    }

    @Override
    public void deleteAccount(int id) {
        accountRepos.deleteById(id);
    }

    @Override
    public Account getAccountByEmail(String email) {
        return accountRepos.findAll().stream().filter(account -> account.getEmail().equals(email)).findFirst().orElse(null);
    }

    @Override
    public Account getAccountByEmailAndPassword(String email,String password) {
        return accountRepos.findAll().stream().filter(account -> account.getEmail().equals(email) && account.getPassword().equals(password)).findFirst().orElse(null);
    }
}
