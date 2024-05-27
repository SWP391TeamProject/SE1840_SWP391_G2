package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.DTO.AttachmentDTO;
import fpt.edu.vn.Backend.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin("*")
public class AccountController {
    private final AccountService accountService;

    @Autowired
    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping("/")
    public ResponseEntity<Page<AccountDTO>> getAccounts(@PageableDefault(size = 30) Pageable pageable, @RequestParam int... roleIds) {
        if (roleIds.length == 0) {
            return new ResponseEntity<>(accountService.getAccounts(pageable), HttpStatus.OK);
        }
        var roles = Arrays.stream(roleIds).boxed().collect(Collectors.toSet());
        return new ResponseEntity<>(accountService.getAccountsByRoleIds(pageable, roles), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccountDTO> getAccountById(@PathVariable int id) {
        return new ResponseEntity<>(accountService.getAccountById(id), HttpStatus.OK);
    }

    @PostMapping("/")
    public ResponseEntity<AccountDTO> createAccount(@RequestBody AccountDTO accountDTO) {
        return new ResponseEntity<>(accountService.createAccount(accountDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AccountDTO> updateAccount(@RequestBody AccountDTO accountDTO, @PathVariable int id) {
        if (accountService.getAccountById(id) == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        accountDTO.setAccountId(id);
        return new ResponseEntity<>(accountService.updateAccount(accountDTO), HttpStatus.OK);
    }

    @PostMapping("/avatar/{id}")
    public ResponseEntity<AttachmentDTO> addProfileImage(@PathVariable int id, @RequestParam("file") MultipartFile file) {
        return new ResponseEntity<>(accountService.setAvatar(id, file), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<AccountDTO> deleteAccount(@PathVariable int id) {
        if (accountService.getAccountById(id) == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            accountService.deactivateAccount(id);
            return new ResponseEntity<>(HttpStatus.OK);
        }
    }
}
