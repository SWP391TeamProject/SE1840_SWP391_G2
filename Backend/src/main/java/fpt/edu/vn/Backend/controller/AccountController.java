package fpt.edu.vn.Backend.controller;

import com.fasterxml.jackson.databind.DatabindException;
import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.DTO.AttachmentDTO;
import fpt.edu.vn.Backend.exporter.AccountExporter;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.service.AccountService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.checkerframework.checker.units.qual.A;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin("*")
@Slf4j
public class AccountController {
    private final AccountService accountService;

    @Autowired
    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping("/")
    public ResponseEntity<Page<AccountDTO>> getAccounts(@PageableDefault(size = 30) Pageable pageable,
                                                        @RequestParam(required = false,name = "Role") Account.Role role) {
        log.info("Get accounts with role: {}", role);
        if (role == null) {
            return new ResponseEntity<>(accountService.getAccounts(pageable), HttpStatus.OK);
        }
        return new ResponseEntity<>(accountService.getAccountsByRoles(pageable, Set.of(role)), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccountDTO> getAccountById(@PathVariable int id) {
        return new ResponseEntity<>(accountService.getAccountById(id), HttpStatus.OK);
    }
//    @GetMapping("/{id}")
//    public ResponseEntity<AccountDTO> getAccountById(@PathVariable int id) {
//            return new ResponseEntity<>(new AccountDTO(accountService.getAccountById(id)), HttpStatus.OK);
//    }

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
            AccountDTO dto = new AccountDTO();
            dto.setAccountId(id);
            dto.setStatus(Account.Status.DISABLED);
            accountService.updateAccount(dto);
            return new ResponseEntity<>(HttpStatus.OK);
        }
    }
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Account> deleteAccount(@PathVariable int id) {
//        if (accountService.getAccountById(id) == null) {
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        } else {
//            accountService.getAccountById(id).setStatus(false);
//            return new ResponseEntity<>(HttpStatus.OK);
//        }
//    }

    @PostMapping("/request-reset-password/")
    public ResponseEntity<AccountDTO> requestResetPassword(@RequestParam int id) {
        if (accountService.getAccountById(id) == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            try {
                accountService.requestResetPassword(id);
            } catch (MessagingException e) {
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return new ResponseEntity<>(HttpStatus.OK);
        }
    }

    @PostMapping("/reset-password/")
    public ResponseEntity<AccountDTO> resetPassword(@RequestParam String newPassword,
                                                    @RequestParam String code) {
        if (!accountService.confirmResetPassword(code, newPassword)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/export")
    public void exportToExcel(HttpServletResponse response){
        response.setContentType("application/octet-stream");
        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
        String currentDateTime = dateFormatter.format(new Date());

        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=accounts_" + currentDateTime + ".xlsx";
        response.setHeader(headerKey, headerValue);
        Pageable pageable = Pageable.unpaged();
        List<AccountDTO> listUsers = accountService.getAccounts(pageable).getContent();

        AccountExporter excelExporter = new AccountExporter(listUsers);

        excelExporter.export(response);
    }

}
