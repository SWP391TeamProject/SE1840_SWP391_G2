package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.AuthResponseDTO;
import fpt.edu.vn.Backend.DTO.LoginDTO;
import fpt.edu.vn.Backend.DTO.RegisterDTO;
import org.springframework.stereotype.Service;

public interface AuthService {
    public AuthResponseDTO login(LoginDTO loginDTO);

    public AuthResponseDTO logout();
    AuthResponseDTO register(RegisterDTO registerDTO);
    String refreshToken(String token);
    String forgotPassword(String email);
    public AuthResponseDTO loginWithGoogle(String token);
    String loginWithFacebook(String token);

}
