package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.pojo.Account;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AccountService {
    List<Account> getAllAccounts(Pageable pageable);
    Account createAccount(Account account);
    Account getAccountById(int id);
    Account updateAccount(Account account);
    void deleteAccount(int id);
    Account getAccountByEmail(String username);
    Account getAccountByEmailAndPassword(String email, String password);

}
