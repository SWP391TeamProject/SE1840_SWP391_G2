package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.dto.AccountAdminDTO;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {
    private final AccountService accountService;

    @Autowired
    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping("/")
    public ResponseEntity<List<AccountAdminDTO>> getAllAccounts(@RequestParam int pageNumb, @RequestParam int pageSize, @RequestParam String sortBy) {
        Pageable pageable = PageRequest.of(pageNumb, pageSize, Sort.by(sortBy).ascending());
        return new ResponseEntity<>(accountService.getAllAccounts(pageable), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Account> getAccountById(@PathVariable int id) {
        return new ResponseEntity<>(accountService.getAccountById(id), HttpStatus.OK);
    }

    @PostMapping("/create")
    public ResponseEntity<Account> createAccount(@RequestBody Account account) {
        return new ResponseEntity<>(accountService.createAccount(account), HttpStatus.CREATED);
    }

    @PutMapping("/update")
    public ResponseEntity<Account> updateAccount(@RequestBody Account account) {
        return new ResponseEntity<>(accountService.updateAccount(account), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Account> deleteAccount(@PathVariable int id) {
        if (accountService.getAccountById(id) == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            accountService.deleteAccount(id);
            return new ResponseEntity<>(HttpStatus.OK);
        }
    }
}
