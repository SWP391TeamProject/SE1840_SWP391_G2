package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.dto.AuthResponseDTO;
import fpt.edu.vn.Backend.dto.LoginDTO;
import org.springframework.stereotype.Service;

public interface AuthService {
    public AuthResponseDTO login(LoginDTO loginDTO);

    public AuthResponseDTO logout();
    String register(String username, String password, String email);
    String refreshToken(String token);
    String forgotPassword(String email);
    String loginWithGoogle(String token);
    String loginWithFacebook(String token);

}
