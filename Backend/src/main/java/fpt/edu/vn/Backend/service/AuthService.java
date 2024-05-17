package fpt.edu.vn.Backend.service;

public interface AuthService {
    String login(String username, String password);
    String register(String username, String password, String email);
    String logout(String token);
    String refreshToken(String token);
    String forgotPassword(String email);
    String loginWithGoogle(String token);
    String loginWithFacebook(String token);

}
