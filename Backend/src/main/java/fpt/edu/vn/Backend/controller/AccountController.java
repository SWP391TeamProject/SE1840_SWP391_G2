package fpt.edu.vn.Backend.controller;

import com.azure.core.annotation.Post;
import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.DTO.AttachmentDTO;
import fpt.edu.vn.Backend.DTO.MonthlyBalanceDTO;
import fpt.edu.vn.Backend.DTO.request.TwoFactorAuthChangeDTO;
import fpt.edu.vn.Backend.exception.InvalidInputException;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.exporter.AccountExporter;
import fpt.edu.vn.Backend.oauth2.security.OAuth2BiddifyUser;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.Item;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.security.Authorizer;
import fpt.edu.vn.Backend.security.CurrentUser;
import fpt.edu.vn.Backend.security.JwtUser;
import fpt.edu.vn.Backend.service.AccountService;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
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
    public ResponseEntity<Page<AccountDTO>> getAccounts(
            Principal principal,
            @PageableDefault(size = 50) Pageable pageable,
            @Nullable Account.Role role,
            @Nullable Account.Status status,
            @Nullable String search) {
        JwtUser jwtUser = Authorizer.requireUser(principal);
        if (!Authorizer.ADMIN.contains(jwtUser.getRole())) {
            role = Account.Role.MEMBER; // staff and manager can only view members
        }
        return new ResponseEntity<>(accountService.getAccounts(pageable, role, status, search), HttpStatus.OK);
    }
    @GetMapping("/monthly")
    public List<MonthlyBalanceDTO> getMonthlyBalances(@RequestParam int year) {
        return accountService.getMonthlyBalances(year);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccountDTO> getAccountById(
            Principal principal,
            @PathVariable int id) {
        JwtUser jwtUser = Authorizer.requireUser(principal);
        AccountDTO a = accountService.getAccountById(id);
        if (a == null)
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        if (a.getAccountId() != jwtUser.getUserId()) {
            if (jwtUser.getRole() == Account.Role.MEMBER) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
        }
        return new ResponseEntity<>(a, HttpStatus.OK);
    }

    @GetMapping("/user/me")
    @PreAuthorize("hasAuthority('USER')")
    public Account getCurrentUser(@CurrentUser OAuth2BiddifyUser userPrincipal) {
        return accountRepos.findByEmail(userPrincipal.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userPrincipal.getUsername()));
    }

    @PostMapping("/")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<AccountDTO> createAccount(@RequestBody AccountDTO accountDTO) {
        return new ResponseEntity<>(accountService.createAccount(accountDTO), HttpStatus.CREATED);
    }

    @PostMapping("/{id}")
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

    @PostMapping("/disable/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<AccountDTO> disableAccount(@PathVariable int id) {
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
    public ResponseEntity<byte[]> exportToExcel(Authentication authentication){
        AccountDTO account = accountService.getAccountByEmail(authentication.getName());
        if (account == null || account.getRole() != Account.Role.ADMIN) {
            throw new InvalidInputException("You are not authorized to perform this action");
        }
        List<AccountDTO> listAccounts;
        String keyword = "";
        {
            listAccounts = accountService.getAccounts(PageRequest.of(0, 1000), null, null, keyword).getContent();
        }

        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
        String currentDateTime = dateFormatter.format(new Date());

        String headerValue = "filename=accounts_" + currentDateTime + ".xlsx";

        AccountExporter excelExporter = new AccountExporter(listAccounts);

        ByteArrayOutputStream stream = excelExporter.export();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", headerValue);

        return ResponseEntity.ok()
                .headers(headers)
                .body(stream.toByteArray());
    }

}
