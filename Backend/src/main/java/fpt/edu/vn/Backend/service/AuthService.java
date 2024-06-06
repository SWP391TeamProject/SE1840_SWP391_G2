package fpt.edu.vn.Backend.service;

import com.nimbusds.jose.JOSEException;
import fpt.edu.vn.Backend.DTO.AuthResponseDTO;
import fpt.edu.vn.Backend.DTO.LoginDTO;
import fpt.edu.vn.Backend.DTO.RegisterDTO;
import fpt.edu.vn.Backend.DTO.request.LogOutRequest;
import jakarta.mail.MessagingException;
import org.jetbrains.annotations.NotNull;
import org.springframework.mail.MailException;

import java.text.ParseException;

public interface AuthService {
    public AuthResponseDTO login(LoginDTO loginDTO);

    public void logout(LogOutRequest request) throws ParseException, JOSEException;
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
