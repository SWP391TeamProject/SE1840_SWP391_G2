package fpt.edu.vn.Backend.service;

import com.google.common.base.Preconditions;
import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.DTO.AttachmentDTO;
import fpt.edu.vn.Backend.DTO.request.TwoFactorAuthChangeDTO;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.repository.AccountRepos;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Set;

@Service
public class AccountServiceImpl implements AccountService {
    private static final Logger logger = LoggerFactory.getLogger(AccountServiceImpl.class);
    @Value("${app.email}")
    private String systemEmail;
    private final AccountRepos accountRepos;
    private final AttachmentServiceImpl attachmentServiceImpl;
    private final JavaMailSender mailSender;

    @Autowired
    public AccountServiceImpl(AccountRepos accountRepos, AttachmentServiceImpl attachmentServiceImpl, JavaMailSender mailSender) {
        this.accountRepos = accountRepos;
        this.attachmentServiceImpl = attachmentServiceImpl;
        this.mailSender = mailSender;
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
            account.setNickname(accountDTO.getNickname());
        if (accountDTO.getPhone() != null)
            account.setPhone(accountDTO.getPhone());

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
    public @Nullable AccountDTO getAccountByEmailAndPassword(@NotNull String email, @NotNull String password) {
        return accountRepos.findByEmailAndPassword(email, password).map(this::mapEntityToDTO).orElse(null);
    }

    @Override
    public @NotNull AccountDTO createAccount(@NotNull AccountDTO account) {
        Account a = new Account();
        // avatar dùng method riêng
        // không set trực tiếp từ DTO tránh exploit
        a.setNickname(account.getNickname());
        a.setRole(account.getRole());
        a.setEmail(account.getEmail());
        a.setPhone(account.getPhone());
        a.setStatus(Account.Status.ACTIVE);
        a.setPassword(account.getPassword());
        return mapEntityToDTO(accountRepos.save(a));
    }

    @Override
    public @NotNull AccountDTO updateAccount(@NotNull AccountDTO account, @NotNull Account.Role editorRole) {
        Preconditions.checkNotNull(account.getAccountId(), "Account is not identifiable");
        Account acc = accountRepos.findById(account.getAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("Account", "accountId", account.getAccountId()));
        return mapEntityToDTO(accountRepos.save(mapDTOToEntity(account, acc, editorRole)));
    }

    @Override
    public @NotNull AttachmentDTO setAvatar(int accountId, @NotNull MultipartFile file) {
        try {
            return attachmentServiceImpl.uploadAccountAttachment(file, accountId);
        } catch (IOException e) {
            throw new ResourceNotFoundException("Account", "accountId", accountId);
        }
    }

    @Override
    public void change2fa(int id, @NotNull TwoFactorAuthChangeDTO dto) {
        Account a = accountRepos.findByAccountIdAndPassword(id, dto.getCurrentPassword())
                .orElseThrow(() -> new ResourceNotFoundException("Account", "accountId", id));
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
}