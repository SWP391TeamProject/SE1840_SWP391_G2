package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.repository.AccountRepos;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class AccountServiceImpl implements AccountService{
    private final AccountRepos accountRepos;


    public AccountServiceImpl(AccountRepos accountRepos) {
        this.accountRepos = accountRepos;
    }

    @Override
    public Page<Account> getAllAccounts(Pageable pageable) {
        return accountRepos.findAll(pageable);
    }

    @Override
    public Account createAccount(Account account) {
        return null;
    }

    @Override
    public Account getAccountById(int id) {
        return null;
    }

    @Override
    public Account editProfiles(Account account) {
        return null;
    }


    @Override
    public void deleteAccount(int id) {

    }

    @Override
    public Account getAccountByUsername(String username) {
        return null;
    }

    @Override
    public Account updateAccount(Account account) {
        return null;
    }
}
