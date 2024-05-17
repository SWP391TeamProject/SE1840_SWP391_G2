package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.repository.AccountRepos;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


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
        return accountRepos.save(account);
    }

    @Override
    public Account getAccountById(int id) {
        return accountRepos.findById(id).orElse(null);
    }

    @Override
    public Account editProfiles(Account account) {
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
