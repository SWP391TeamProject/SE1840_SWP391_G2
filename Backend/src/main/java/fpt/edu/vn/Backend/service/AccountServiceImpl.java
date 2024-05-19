package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.repository.AccountRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AccountServiceImpl implements AccountService {
    @Autowired
    private AccountRepos accountRepos;

    @Override
    public List<Account> getAllAccounts() {
        return accountRepos.findAll();
    }

    @Override
    public Account createAccount(Account account) {
        return accountRepos.save(account);
    }

    @Override
    @Transactional
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
    public Account getAccountByEmailAndPassword(String email, String password) {
        return accountRepos.findAll().stream().filter(account -> account.getEmail().equals(email) && account.getPassword().equals(password)).findFirst().orElse(null);
    }

    @Override
    public Account saveAccount(Account account) {
        return accountRepos.save(account);
    }
}
