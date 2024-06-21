package fpt.edu.vn.Backend.service;


import com.nimbusds.jose.JOSEException;

import fpt.edu.vn.Backend.DTO.AuthResponseDTO;
import fpt.edu.vn.Backend.DTO.LoginDTO;
import fpt.edu.vn.Backend.DTO.RegisterDTO;
import fpt.edu.vn.Backend.DTO.request.ChangePasswordDTO;
import fpt.edu.vn.Backend.DTO.request.LogOutRequest;
import fpt.edu.vn.Backend.exception.CooldownException;
import fpt.edu.vn.Backend.exception.InvalidInputException;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.oauth2.exception.AppException;
import fpt.edu.vn.Backend.oauth2.security.TokenProvider;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.Token;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.TokenRepos;
import fpt.edu.vn.Backend.security.CustomUserDetailsService;
import fpt.edu.vn.Backend.security.JWTGenerator;
import fpt.edu.vn.Backend.security.PasswordEncoderConfig;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import net.jodah.expiringmap.ExpiringMap;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.ParseException;
import java.util.Date;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class AuthServiceImpl implements AuthService{


    private final AccountRepos accountRepos;
    private final JWTGenerator jwtGenerator;
    private final AuthenticationManager authenticationManager;
    // Password regex: at least 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character
    private final String PASSWORD_REGEX = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$";
    private final JavaMailSender mailSender;
    @Value("${app.email}")
    private String systemEmail;
    @Value("${app.reset-email-link}")
    private String resetEmailLink;
    @Value("${app.activate-account-link}")
    private String activateAccountLink;
    @Value("${app.verify-2fa-link}")
    private String verify2faLink;
    private final ExpiringMap<String, Integer> resetPasswordCodeCache = ExpiringMap.builder().variableExpiration().build();
    private final ExpiringMap<Integer, Object> resetPasswordCooldownCache = ExpiringMap.builder().variableExpiration().build();
    private final ExpiringMap<String, Integer> activationCodeCache = ExpiringMap.builder().variableExpiration().build();
    private final ExpiringMap<Integer, Object> activationCooldownCache = ExpiringMap.builder().variableExpiration().build();
    private final ExpiringMap<String, Integer> verify2faCache = ExpiringMap.builder().variableExpiration().build();
    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);
    private TokenProvider tokenProvider;
    private TokenRepos tokenRepos;
    private CustomUserDetailsService customUserDetailService;
    @Autowired
    private PasswordEncoderConfig passwordEncoder;
    @Autowired
    public AuthServiceImpl(AccountRepos accountRepos, JWTGenerator jwtGenerator, AuthenticationManager authenticationManager, JavaMailSender mailSender, TokenProvider tokenProvider, TokenRepos tokenRepos, CustomUserDetailsService customUserDetailService) {
        this.accountRepos = accountRepos;
        this.jwtGenerator = jwtGenerator;
        this.authenticationManager = authenticationManager;
        this.mailSender = mailSender;
        this.tokenProvider = tokenProvider;
        this.tokenRepos = tokenRepos;
        this.customUserDetailService = customUserDetailService;
    }

    @Override
    public AuthResponseDTO register(RegisterDTO registerDTO) {
        Account newAccount ;
        try {
            if(registerDTO.getName().isEmpty() || registerDTO.getEmail().isEmpty() || registerDTO.getPassword().isEmpty()){
                throw new InvalidInputException("Name or Email or password is empty!");
            }

            if (!registerDTO.getPassword().equals(registerDTO.getConfirmPassword())) {
                throw new InvalidInputException("Password and confirm password do not match!");
            }


//            if (!registerDTO.getPassword().matches(PASSWORD_REGEX)) {
//            throw new InvalidInputException("Password must be at least 8 characters long" +
//                    ", contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
//        }

            accountRepos.findByEmail(registerDTO.getEmail()).ifPresent(account -> {
                throw new InvalidInputException("Email already exists! try login instead.");
            });

            newAccount = new Account();
            newAccount.setNickname(registerDTO.getName());
            newAccount.setEmail(registerDTO.getEmail());
            newAccount.setPassword(passwordEncoder.bcryptEncoder().encode(registerDTO.getPassword()).toString()); // Consider hashing the password before saving
            newAccount.setRole(Account.Role.MEMBER);
            newAccount.setProvider(Account.AuthProvider.LOCAL);
            newAccount = accountRepos.save(newAccount);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        try {
            requestActivateAccount(newAccount.getEmail()); // send activation email
        } catch (MessagingException | IllegalAccessException e) {
            throw new RuntimeException(e);
        }

        // After successful registration, log the user in and generate a token
        UserDetails userDetails = customUserDetailService.loadUserByUsername(newAccount.getEmail());
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        userDetails,
                        registerDTO.getPassword(),
                        userDetails.getAuthorities()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtGenerator.generateToken(authentication);

        return AuthResponseDTO.builder()
                .accessToken(token)
                .email(newAccount.getEmail())
                .role(newAccount.getRole())
                .status(newAccount.getStatus())
                .build();
    }

    public void request2fa(@NotNull Account a) throws MessagingException {
        String code;
        do {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < 6; i++)
                sb.append((int) (Math.random() * 10));
            code = sb.toString();
        } while (verify2faCache.containsKey(code));

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, false);
        helper.setFrom(systemEmail);
        helper.setTo(a.getEmail());
        helper.setSubject("[Biddify] Two-factor Authentication code");
        String link = String.format(verify2faLink, code);
        helper.setText("""
                <p>There was a request to log in into your account</p>
                <p>Your 2FA code: %s</p>
                <p>Click here to verify your log-in request: <a href="%s">Verify 2FA</a></p>
                <p>The code will expire after 10 minutes.</p>
                <p>If that was not your request, your password might have been leaked. Please ignore this email.</p>
                <p>- Biddify</p>
                """.formatted(code, link), true);
        mailSender.send(message);

        verify2faCache.put(code, a.getAccountId(), 10, TimeUnit.MINUTES);
        logger.info("Sending 2FA code for account {} to {} with code {}", a.getAccountId(), a.getEmail(), code);
    }

    private AuthResponseDTO forceLogin(Account user) {
        UserDetails userDetails = customUserDetailService.loadUserByUsername(user.getEmail());
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userDetails,
                null, // password is not needed here
                userDetails.getAuthorities()
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtGenerator.generateToken(authentication);
        return new AuthResponseDTO(user, token);
    }

    @Override
    public AuthResponseDTO login(LoginDTO loginDTO) {
        if(loginDTO.getEmail().isEmpty() || loginDTO.getPassword().isEmpty()){
            throw new InvalidInputException("Email or password is empty!");
        }

        Optional<Account> userOptional = accountRepos.findByEmail(loginDTO.getEmail());

        if (userOptional.isEmpty()) {
            throw new ResourceNotFoundException ("Invalid email or password");
        }

        Account user = userOptional.get();

        try{
            UserDetails userDetails = customUserDetailService.loadUserByUsername(user.getEmail());
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            loginDTO.getPassword(),
                            userDetails.getAuthorities()
                    )
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }catch (Exception e){
            throw new InvalidInputException("Invalid email or password");
        }

        if (user.isRequire2fa()) {
            try {
                request2fa(user);
            } catch (MessagingException e) {
                throw new RuntimeException(e);
            }
            return AuthResponseDTO.builder().redirect2fa(true).build();
        }

        return forceLogin(user);
    }

    @Override
    public void logout(LogOutRequest request) throws ParseException, JOSEException {
        try {
            var signToken = tokenProvider.verifyToken(request.getToken(), true);
            String jit = signToken.getJWTClaimsSet().getJWTID();
            Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();

            Token invalidatedToken =
                    Token.builder()
                            .token(jit)
                            .expiryTime(expiryTime)
                            .tokenType("Bearer")
                            .build();
            tokenRepos.save(invalidatedToken);
            tokenProvider.cleanupExpiredTokens();

        } catch (AppException exception){
            logger.info("Token already expired");
        }
    }

    @Override
    public String refreshToken(String token) {
        return "";
    }

    @Override
    public AuthResponseDTO loginWithGoogle(String token) {
        String email = jwtGenerator.getEmailFromToken(token);
        Optional<Account> userOptional = accountRepos.findByEmail(email);
        Account user = userOptional.get();

        return new AuthResponseDTO(user, token);

    }

    @Override
    public AuthResponseDTO loginWithFacebook(String token) {
        String email = jwtGenerator.getEmailFromToken(token);
        Optional<Account> userOptional = accountRepos.findByEmail(email);
        Account user = userOptional.get();
        return new AuthResponseDTO(user, token);
    }

    @Override
    public boolean changePassword(int id, ChangePasswordDTO changePasswordDTO) throws IllegalAccessException {
        Account a = accountRepos.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account", "id", id));
        if (!passwordEncoder.bcryptEncoder().matches(changePasswordDTO.getOldPassword(),a.getPassword()))
            throw new InvalidInputException("Old password is incorrect!");
        if (!changePasswordDTO.getNewPassword().equals(changePasswordDTO.getConfirmPassword()))
            throw new InvalidInputException("New password and confirm password do not match!");
//        if (!changePasswordDTO.getNewPassword().matches(PASSWORD_REGEX)) {
//            throw new InvalidInputException("Password must be at least 8 characters long" +
//                    ", contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
//        }
        a.setPassword(changePasswordDTO.getNewPassword());
        accountRepos.save(a);
        return true;
    }

    @Override
    public void requestResetPassword(@NotNull String email) throws MessagingException, IOException {
        Account a = accountRepos.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Account", "email", email));

        if (resetPasswordCooldownCache.containsKey(a.getAccountId()))
            throw new CooldownException("Please wait 10 minutes to request a new password.");

        resetPasswordCooldownCache.put(a.getAccountId(), 0, 10, TimeUnit.MINUTES);

        String code;
        do {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < 6; i++)
                sb.append((int) (Math.random() * 10));
            code = sb.toString();
        } while (resetPasswordCodeCache.containsKey(code));

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, false);
        helper.setFrom(systemEmail);
        helper.setTo(a.getEmail());
        helper.setSubject("[Biddify] Reset Password");
        // Read the HTML file into a String
        String htmlContent = new String(Files.readAllBytes(Paths.get("src/main/resources/templates/resetpasswordEmail.html")));

        // Replace placeholders in the HTML content with actual values
        htmlContent = htmlContent.replace("{code}", code);
        htmlContent = htmlContent.replace("{link}", String.format(resetEmailLink, code));

        // Set the HTML content as the body of the email
        helper.setText(htmlContent, true);
        mailSender.send(message);

        resetPasswordCodeCache.put(code, a.getAccountId(), 1, TimeUnit.HOURS);
        logger.info("Sending reset password account {} to {} with code {}", a.getAccountId(), a.getEmail(), code);
    }

    @Override
    public boolean confirmResetPassword(@NotNull String resetCode, @NotNull String newPassword) {
//        if (!newPassword.matches(PASSWORD_REGEX)) {
//            throw new InvalidInputException("Password must be at least 8 characters long" +
//                    ", contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
//        }
        Integer id = resetPasswordCodeCache.get(resetCode);
        if (id == null)
            return false;
        Account acc = accountRepos.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account", "accountId", id));
        acc.setPassword(newPassword);
        accountRepos.save(acc);
        resetPasswordCodeCache.remove(resetCode);
        logger.info("Reset password for account {} with code {} successfully", id, resetCode);
        return true;
    }

    @Override
    public void requestActivateAccount(@NotNull String email) throws MailException, MessagingException, IllegalAccessException {
        Account a = accountRepos.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Account", "email", email));

        if (a.getStatus() == Account.Status.ACTIVE)
            throw new IllegalAccessException("The account is already activated");

        if (activationCooldownCache.containsKey(a.getAccountId()))
            throw new CooldownException("Please wait 10 minutes to activate your account again");

        activationCooldownCache.put(a.getAccountId(), 0, 10, TimeUnit.MINUTES);

        String code;
        do {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < 6; i++)
                sb.append((int) (Math.random() * 10));
            code = sb.toString();
        } while (activationCodeCache.containsKey(code));

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, false);
        helper.setFrom(systemEmail);
        helper.setTo(a.getEmail());
        helper.setSubject("[Biddify] Activate account");
        String link = String.format(activateAccountLink, code);
        helper.setText("""
                <p>Your activation code: %s</p>
                <p>Click here to activate your account: <a href="%s">Activate account</a></p>
                <p>The code will expire after 1 hour.</p>
                <p>- Biddify</p>
                """.formatted(code, link), true);
        mailSender.send(message);

        activationCodeCache.put(code, a.getAccountId(), 1, TimeUnit.HOURS);
        logger.info("Sending activation code for account {} to {} with code {}", a.getAccountId(), a.getEmail(), code);
    }

    @Override
    public boolean confirmActivateAccount(@NotNull String activateCode) {
        Integer id = activationCodeCache.get(activateCode);
        if (id == null)
            return false;
        Account acc = accountRepos.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account", "accountId", id));
        if (acc.getStatus() == Account.Status.ACTIVE)
            throw new IllegalStateException("Account already activated");
        acc.setStatus(Account.Status.ACTIVE);
        accountRepos.save(acc);
        activationCodeCache.remove(activateCode);
        logger.info("Activated account {} with code {} successfully", id, activateCode);
        return true;
    }

    @Override
    public AuthResponseDTO confirm2fa(@NotNull String activateCode) {
        Integer id = verify2faCache.get(activateCode);
        if (id == null)
            return null;
        Account acc = accountRepos.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account", "accountId", id));
        verify2faCache.remove(activateCode);
        logger.info("Verified 2FA for account {} with code {} successfully", id, activateCode);
        return forceLogin(acc);
    }
}
