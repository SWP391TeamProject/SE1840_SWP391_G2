package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.pojo.Account;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

public interface AccountService {
    Page<Account> getAllAccounts(Pageable pageable);
    Account createAccount(Account account);
    Account getAccountById(int id);
    Account editProfiles(Account account);
    void deleteAccount(int id);

    Account getAccountByUsername(String username);

}
