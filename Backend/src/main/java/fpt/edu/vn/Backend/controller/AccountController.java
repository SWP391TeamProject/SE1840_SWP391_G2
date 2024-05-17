package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController("/accounts")
public class AccountController {
    private  final AccountService accountService;
    @Autowired
    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }
    @GetMapping("/")
    public ResponseEntity<Account> getAllAccounts(@RequestParam int page, @RequestParam int size, @RequestParam String sort) {
        return null;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Account> getAccountById(@PathVariable String id) {
        return null;
    }
    @PostMapping("/create")
    public ResponseEntity<Account> createAccount(@RequestBody Account account) {
        return null;
    }

    @PutMapping("/update")
    public ResponseEntity<Account> updateAccount(@RequestBody Account account) {
        return null;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Account> deleteAccount(@PathVariable String id) {
        return null;
    }

}
