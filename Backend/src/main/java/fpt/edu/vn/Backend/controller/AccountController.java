package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.DTO.AttachmentDTO;
import fpt.edu.vn.Backend.DTO.MonthlyBalanceDTO;
import fpt.edu.vn.Backend.DTO.request.TwoFactorAuthChangeDTO;
import fpt.edu.vn.Backend.exporter.AccountExporter;
import fpt.edu.vn.Backend.oauth2.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.oauth2.security.UserPrincipal;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.security.Authorizer;
import fpt.edu.vn.Backend.security.CurrentUser;
import fpt.edu.vn.Backend.security.JwtUser;
import fpt.edu.vn.Backend.service.AccountService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin("*")
@Slf4j
public class AccountController {
    private final AccountService accountService;
    @Autowired
    private AccountRepos accountRepos;
    @Autowired
    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping("/")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Page<AccountDTO>> getAccounts(@PageableDefault(size = 50) Pageable pageable,
                                                        @RequestParam(required = false,name = "Role") Account.Role role) {
        log.info("Get accounts with role: {}", role);
        if (role == null) {
            return new ResponseEntity<>(accountService.getAccounts(pageable), HttpStatus.OK);
        }
        return new ResponseEntity<>(accountService.getAccountsByRoles(pageable, Set.of(role)), HttpStatus.OK);
    }
    @GetMapping("/monthly")
    public List<MonthlyBalanceDTO> getMonthlyBalances(@RequestParam int year) {
        return accountService.getMonthlyBalances(year);
    }

    @GetMapping("/search/{name}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Page<AccountDTO>> searchAccounts(@PageableDefault(size = 50) Pageable pageable,
                                                        @PathVariable String name) {
        log.info("Get accounts with name: {}", name);
        if (name == null) {
            return new ResponseEntity<>(accountService.getAccounts(pageable), HttpStatus.OK);
        }
        return new ResponseEntity<>(accountService.getAccountsByNameOrEmail(pageable, name), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER') or authentication.token.claims['userId'] == #id")
    public ResponseEntity<AccountDTO> getAccountById(@PathVariable int id) {
        return new ResponseEntity<>(accountService.getAccountById(id), HttpStatus.OK);
    }

    @GetMapping("/user/me")
    @PreAuthorize("hasAuthority('USER')")
    public Account getCurrentUser(@CurrentUser UserPrincipal userPrincipal) {
        return accountRepos.findByEmail(userPrincipal.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userPrincipal.getEmail()));
    }

    @PostMapping("/")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<AccountDTO> createAccount(@RequestBody AccountDTO accountDTO) {
        return new ResponseEntity<>(accountService.createAccount(accountDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or authentication.token.claims['userId'] == #id")
    public ResponseEntity<AccountDTO> updateAccount(Principal principal, @RequestBody AccountDTO accountDTO, @PathVariable int id) {
        if (accountService.getAccountById(id) == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        accountDTO.setAccountId(id);
        /*
            NOTE: Các trường có thể cập nhật
            - Nickname, Phone
            - Yêu cầu role ADMIN: role, status, balance

            Cập nhật dùng endpoint riêng:
            - Avatar
            - Password
            - 2FA
        */
        JwtUser jwtUser = Authorizer.expectAdminOrUserId(principal, id);
        return new ResponseEntity<>(accountService.updateAccount(accountDTO, jwtUser.getRole()), HttpStatus.OK);
    }

    @PostMapping("/change-2fa/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or authentication.token.claims['userId'] == #id")
    public ResponseEntity<?> change2fa(@RequestBody TwoFactorAuthChangeDTO dto, @PathVariable int id) {
        try {
            accountService.change2fa(id, dto);
        } catch (IllegalAccessException e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/avatar/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or authentication.token.claims['userId'] == #id")
    public ResponseEntity<AttachmentDTO> addProfileImage(@PathVariable int id, @RequestParam("file") MultipartFile file) {
        return new ResponseEntity<>(accountService.setAvatar(id, file), HttpStatus.OK);
    }

    @PostMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or authentication.token.claims['userId'] == #id")
    public ResponseEntity<AccountDTO> deleteAccount(@PathVariable int id) {
        if (accountService.getAccountById(id) == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            AccountDTO dto = new AccountDTO();
            dto.setAccountId(id);
            dto.setStatus(Account.Status.DISABLED);
            accountService.updateAccount(dto, Account.Role.ADMIN); // grant access as ADMIN
            return new ResponseEntity<>(HttpStatus.OK);
        }
    }

    @PutMapping("/activate/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or authentication.token.claims['userId'] == #id")
    public ResponseEntity<AccountDTO> activateAccount(@PathVariable int id) {
        if (accountService.getAccountById(id) == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            AccountDTO dto = new AccountDTO();
            dto.setAccountId(id);
            dto.setStatus(Account.Status.ACTIVE);
            accountService.updateAccount(dto, Account.Role.ADMIN); // grant access as ADMIN
            return new ResponseEntity<>(HttpStatus.OK);
        }
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
