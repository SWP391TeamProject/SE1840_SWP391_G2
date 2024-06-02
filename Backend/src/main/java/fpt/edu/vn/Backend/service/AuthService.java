package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.AuthResponseDTO;
import fpt.edu.vn.Backend.DTO.LoginDTO;
import fpt.edu.vn.Backend.DTO.RegisterDTO;
import jakarta.mail.MessagingException;
import org.jetbrains.annotations.NotNull;
import org.springframework.mail.MailException;

public interface AuthService {
    public AuthResponseDTO login(LoginDTO loginDTO);

    public AuthResponseDTO logout();
    AuthResponseDTO register(RegisterDTO registerDTO);
    String refreshToken(String token);
    String forgotPassword(String email);
    public AuthResponseDTO loginWithGoogle(String token);
    AuthResponseDTO loginWithFacebook(String token);
    void requestResetPassword(int accountId) throws MailException, MessagingException;
    boolean confirmResetPassword(@NotNull String resetCode, @NotNull String newPassword);
    void requestActivateAccount(int accountId) throws MailException, MessagingException;
    boolean confirmActivateAccount(@NotNull String activateCode);
}
