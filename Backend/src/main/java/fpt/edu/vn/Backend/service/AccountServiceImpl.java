package fpt.edu.vn.Backend.service;

import com.google.common.base.Preconditions;
import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.DTO.AttachmentDTO;
import fpt.edu.vn.Backend.DTO.MonthlyBalanceDTO;
import fpt.edu.vn.Backend.DTO.request.TwoFactorAuthChangeDTO;
import fpt.edu.vn.Backend.exception.InvalidInputException;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.security.PasswordEncoderConfig;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@Cacheable("accounts")
public class AccountServiceImpl implements AccountService {
    private static final Logger logger = LoggerFactory.getLogger(AccountServiceImpl.class);
    @Value("${app.email}")
    private String systemEmail;
    private final AccountRepos accountRepos;
    private final AttachmentServiceImpl attachmentServiceImpl;
    private final JavaMailSender mailSender;
    private final PasswordEncoderConfig passwordEncoder;

    @Autowired
    public AccountServiceImpl(AccountRepos accountRepos, AttachmentServiceImpl attachmentServiceImpl, JavaMailSender mailSender, PasswordEncoderConfig passwordEncoder) {
        this.accountRepos = accountRepos;
        this.attachmentServiceImpl = attachmentServiceImpl;
        this.mailSender = mailSender;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public @NotNull AccountDTO mapEntityToDTO(@NotNull Account account, @NotNull AccountDTO accountDTO) {
        accountDTO.setAccountId(account.getAccountId());
        accountDTO.setNickname(account.getNickname());
        var avatar = account.getAvatarUrl();
        if (avatar != null)
            accountDTO.setAvatar(attachmentServiceImpl.mapEntityToDTO(avatar));
        if (account.getRole() != null)
            accountDTO.setRole(account.getRole());
        accountDTO.setEmail(account.getEmail());
        accountDTO.setPhone(account.getPhone());
        accountDTO.setStatus(account.getStatus());
        accountDTO.setBalance(account.getBalance());
        // accountDTO.setPassword(account.getPassword()); // DO NOT RETURN PASSWORD
        accountDTO.setCreateDate(account.getCreateDate());
        accountDTO.setUpdateDate(account.getUpdateDate());
        accountDTO.setRequire2fa(account.isRequire2fa());
        return accountDTO;
    }

    @Override
    public @NotNull Account mapDTOToEntity(@NotNull AccountDTO accountDTO, @NotNull Account account, @NotNull Account.Role editorRole) {
        // avatar dùng method riêng
        account.setAccountId(accountDTO.getAccountId());
        if (accountDTO.getNickname() != null)
            account.setNickname(accountDTO.getNickname().strip());
        if (accountDTO.getPhone() != null)
            account.setPhone(accountDTO.getPhone().strip());

        if (editorRole == Account.Role.ADMIN) { // only admin can update these properties
            if (accountDTO.getRole() != null && !String.valueOf(accountDTO.getRole()).isEmpty())
                account.setRole(accountDTO.getRole());
            if (accountDTO.getStatus() != null)
                account.setStatus(accountDTO.getStatus());
            if (accountDTO.getBalance() != null)
                account.setBalance(accountDTO.getBalance());
        }

        return account;
    }

    @Override
    @Cacheable(key = "#pageable.pageNumber",value = "accounts")
    public @NotNull Page<AccountDTO> getAccounts(@NotNull Pageable pageable) {
        return accountRepos.findAll(pageable).map(this::mapEntityToDTO);
    }

    @Override
    public @NotNull Page<AccountDTO> getAccountsByRoles(@NotNull Pageable pageable, Set<Account.Role> roles) {
        var a = accountRepos.findByRoleIn(roles, pageable);
        a = a == null ? Page.empty(pageable) : a;
        return a.map(this::mapEntityToDTO);
    }

    @Override
    public @NotNull Page<AccountDTO> getAccountsByNameOrEmail(@NotNull Pageable pageable, String name) {
        var a = accountRepos.findByNicknameContainingOrEmailContaining(name, pageable);
        a = a == null ? Page.empty(pageable) : a;
        return a.map(this::mapEntityToDTO);
    }

    @Override
    public @Nullable AccountDTO getAccountById(int accountId) {
        return accountRepos.findById(accountId).map(this::mapEntityToDTO).orElse(null);
    }

    @Override
    public @Nullable AccountDTO getAccountByEmail(@NotNull String email) {
        return accountRepos.findByEmail(email).map(this::mapEntityToDTO).orElse(null);
    }

    @Override
    @CacheEvict(value = "accounts", allEntries = true)
    public @NotNull AccountDTO createAccount(@NotNull AccountDTO account) {
        if(accountRepos.findByEmail(account.getEmail()).isPresent())
            throw new InvalidInputException("Email already exists");

        Preconditions.checkState(account.getNickname().length() >= 5, "Nickname must be at least 5 characters");
        Preconditions.checkState(account.getNickname().length() <= 20, "Nickname must not be longer than 20 characters");
        Preconditions.checkState(account.getPhone().length() <= 15, "Phone must not be longer than 15 characters");
        Preconditions.checkState(account.getBalance().signum() >= 0, "Balance must not be negative");
        Preconditions.checkState(account.getPassword().strip().equals(account.getPassword()), "Password must not contain spaces");
        Preconditions.checkState(account.getPassword().length() >= 8, "Password must be at least 8 characters long");
        Preconditions.checkState(account.getPassword().length() <= 30, "Password must not be longer than 30 characters");
        Account a = new Account();
        // avatar dùng method riêng
        // không set trực tiếp từ DTO tránh exploit
        a.setNickname(account.getNickname().strip());
        a.setRole(account.getRole());
        a.setEmail(account.getEmail().strip());
        a.setPhone(account.getPhone().strip());
        a.setStatus(Account.Status.ACTIVE);
        a.setPassword(passwordEncoder.bcryptEncoder().encode(account.getPassword()));
        return mapEntityToDTO(accountRepos.save(a));
    }

    @Override
    @CacheEvict(value = "accounts", allEntries = true)
    public @NotNull AccountDTO updateAccount(@NotNull AccountDTO account, @NotNull Account.Role editorRole) {
        Preconditions.checkNotNull(account.getAccountId(), "Account is not identifiable");
        Preconditions.checkState(account.getNickname().length() >= 5, "Nickname must be at least 5 characters");
        Preconditions.checkState(account.getNickname().length() <= 20, "Nickname must not be longer than 20 characters");
        Preconditions.checkState(account.getPhone().length() <= 15, "Phone must not be longer than 15 characters");
        Preconditions.checkState(account.getBalance() == null || account.getBalance().signum() >= 0, "Balance must not be negative");
        Account acc = accountRepos.findById(account.getAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("Account", "accountId", account.getAccountId()));
        return mapEntityToDTO(accountRepos.save(mapDTOToEntity(account, acc, editorRole)));
    }

    @Override
    @CacheEvict(value = "accounts", allEntries = true)
    public @NotNull AttachmentDTO setAvatar(int accountId, @NotNull MultipartFile file) {
        try {
            return attachmentServiceImpl.uploadAccountAttachment(file, accountId);
        } catch (IOException e) {
            throw new ResourceNotFoundException("Account", "accountId", accountId);
        }
    }

    @Override
    public void change2fa(int id, @NotNull TwoFactorAuthChangeDTO dto) throws IllegalAccessException {
        Account a = accountRepos.findByAccountId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account", "accountId", id));
        if (!passwordEncoder.bcryptEncoder().matches(dto.getCurrentPassword(), a.getPassword()))
            throw new IllegalAccessException("Wrong password");
        a.setRequire2fa(dto.isEnable2fa());
        accountRepos.save(a);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false);
            helper.setFrom(systemEmail);
            helper.setTo(a.getEmail());
            helper.setSubject("[Biddify] Security Warning");
            if (a.isRequire2fa()) {
                helper.setText("""
                        <p>Two-factor authentication has been enabled for your account.</p>
                        <p>Contact us immediately if the request is not initiated by you.</p>
                        <p>- Biddify</p>
                        """, true);
            } else {
                helper.setText("""
                        <p>Two-factor authentication has been disabled for your account.</p>
                        <p>Contact us immediately if the request is not initiated by you.</p>
                        <p>- Biddify</p>
                        """, true);
            }
            mailSender.send(message);
        } catch (MessagingException ignored) {}
    }

    @Override
    public List<MonthlyBalanceDTO> getMonthlyBalances(int year) {
        List<MonthlyBalanceDTO> monthlyBalances = new ArrayList<>();
        for (int month = 1; month <= 12; month++) {
            YearMonth yearMonth = YearMonth.of(year, month);
            LocalDateTime endOfMonth = yearMonth.atEndOfMonth().atTime(23, 59, 59);

            BigDecimal balance = accountRepos.findBalanceByDate(endOfMonth);
            monthlyBalances.add(new MonthlyBalanceDTO(yearMonth, balance));
        }
        return monthlyBalances;
    }


}