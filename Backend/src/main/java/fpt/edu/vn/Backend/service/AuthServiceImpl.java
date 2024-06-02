package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.AuthResponseDTO;
import fpt.edu.vn.Backend.DTO.LoginDTO;
import fpt.edu.vn.Backend.DTO.RegisterDTO;
import fpt.edu.vn.Backend.exception.InvalidInputException;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.security.JWTGenerator;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import net.jodah.expiringmap.ExpiringMap;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class AuthServiceImpl implements AuthService{


    private final AccountRepos accountRepos;
    private final JWTGenerator jwtGenerator;
    private final AuthenticationManager authenticationManager;
    private final JavaMailSender mailSender;
    @Value("${app.email}")
    private String systemEmail;
    @Value("${app.reset-email-link}")
    private String resetEmailLink;
    private final ExpiringMap<String, Integer> resetCodeCache = ExpiringMap.builder().variableExpiration().build();
    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    @Autowired
    public AuthServiceImpl(AccountRepos accountRepos, JWTGenerator jwtGenerator, AuthenticationManager authenticationManager, JavaMailSender mailSender) {
        this.accountRepos = accountRepos;
        this.jwtGenerator = jwtGenerator;
        this.authenticationManager = authenticationManager;
        this.mailSender = mailSender;
    }

    @Override
    public AuthResponseDTO register(RegisterDTO registerDTO) {
        Account newAccount ;
        try {
            if(registerDTO.getEmail().isEmpty() || registerDTO.getPassword().isEmpty()){
                throw new InvalidInputException("Email or password is empty!");
            }

            if (!registerDTO.getPassword().equals(registerDTO.getConfirmPassword())) {
                throw new InvalidInputException("Password and confirm password do not match!");
            }

            if (registerDTO.getPassword().length() < 6) {
                throw new InvalidInputException("Password is too short!");
            }

            accountRepos.findByEmail(registerDTO.getEmail()).ifPresent(account -> {
                throw new InvalidInputException("Email already exists! try login instead.");
            });

            newAccount = new Account();
            newAccount.setEmail(registerDTO.getEmail());
            newAccount.setPassword(registerDTO.getPassword()); // Consider hashing the password before saving
            newAccount.setRole(Account.Role.MEMBER);
            newAccount = accountRepos.save(newAccount);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        // After successful registration, log the user in and generate a token
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        registerDTO.getEmail(),
                        registerDTO.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtGenerator.generateToken(authentication);

        return AuthResponseDTO.builder()
                .accessToken(token)
                .email(newAccount.getEmail())
                .role(newAccount.getRole())
                .build();
    }

    @Override
    public AuthResponseDTO login(LoginDTO loginDTO) {
        if(loginDTO.getEmail().isEmpty() || loginDTO.getPassword().isEmpty()){
            throw new InvalidInputException("Email or password is empty!");
        }

        Optional<Account> userOptional = accountRepos.findByEmailAndPassword(loginDTO.getEmail(), loginDTO.getPassword());

        if (userOptional.isEmpty()) {
            throw new ResourceNotFoundException ("Invalid email or password");
        }
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDTO.getEmail(),
                        loginDTO.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtGenerator.generateToken(authentication);

        Account user = userOptional.get();
        return AuthResponseDTO
                .builder()
                .id(user.getAccountId())
                .accessToken(token)
                .username(user.getNickname())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    @Override
    public AuthResponseDTO logout() {
        return null;
    }

    @Override
    public String refreshToken(String token) {
        return "";
    }

    @Override
    public String forgotPassword(String email) {
        return "";
    }

    @Override
    public AuthResponseDTO loginWithGoogle(String token) {
        String email = jwtGenerator.getEmailFromToken(token);
        Optional<Account> userOptional = accountRepos.findByEmail(email);
        Account user = userOptional.get();
        return AuthResponseDTO
                .builder()
                .id(user.getAccountId())
                .accessToken(token)
                .username(user.getNickname())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    @Override
    public AuthResponseDTO loginWithFacebook(String token) {
        String email = jwtGenerator.getEmailFromToken(token);
        Optional<Account> userOptional = accountRepos.findByEmail(email);
        Account user = userOptional.get();
        return AuthResponseDTO
                .builder()
                .id(user.getAccountId())
                .accessToken(token)
                .username(user.getNickname())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    @Override
    public void requestResetPassword(int accountId) throws MessagingException {
        Account a = accountRepos.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account", "accountId", accountId));

        String code;
        do {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < 6; i++)
                sb.append((int) (Math.random() * 10));
            code = sb.toString();
        } while (resetCodeCache.containsKey(code));

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, false);
        helper.setFrom(systemEmail);
        helper.setTo(a.getEmail());
        helper.setSubject("[Biddify] Reset Password");
        String link = String.format(resetEmailLink, code);
        helper.setText("""
                <p>Click here to reset your password: <a href="%s">Reset Password</a></p>
                <p>The link will expire after 1 hour.</p>
                <p>- Biddify</p>
                """.formatted(link), true);
        mailSender.send(message);

        resetCodeCache.put(code, accountId, 1, TimeUnit.HOURS);
        logger.info("Sending reset password account {} to {} with code {}", accountId, a.getEmail(), code);
    }

    @Override
    public boolean confirmResetPassword(@NotNull String resetCode, @NotNull String newPassword) {
        if (newPassword.length() < 6) {
            throw new InvalidInputException("Password is too short!");
        }
        Integer id = resetCodeCache.get(resetCode);
        if (id == null)
            return false;
        Account acc = accountRepos.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account", "accountId", id));
        acc.setPassword(newPassword);
        accountRepos.save(acc);
        resetCodeCache.remove(resetCode);
        logger.info("Reset password for account {} with code {} successfully", id, resetCode);
        return true;
    }
}
