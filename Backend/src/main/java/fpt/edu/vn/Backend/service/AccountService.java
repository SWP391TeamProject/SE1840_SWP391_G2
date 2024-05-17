package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.pojo.Account;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AccountService {
    List<Account> getAllAccounts();
    Account createAccount(Account account);
    Account getAccountById(int id);
    Account updateAccount(Account account);
    void deleteAccount(int id);
    Account getAccountByUsername(String username);

    Account getAccountByUsernameAndPassword(String username, String password);
    Account getAccountByEmailAndPassword(String email);



}
