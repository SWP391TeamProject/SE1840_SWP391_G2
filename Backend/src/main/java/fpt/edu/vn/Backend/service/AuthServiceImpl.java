package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.dto.AuthResponseDTO;
import fpt.edu.vn.Backend.dto.LoginDTO;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.security.JWTGenerator;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
@Service

public class AuthServiceImpl implements AuthService{


    private final AccountRepos accountRepos;
    private JWTGenerator jwtGenerator;
    private AuthenticationManager authenticationManager;




    public AuthServiceImpl(AccountRepos accountRepos) {
        this.accountRepos = accountRepos;
    }


    @Override
    public String register(String username, String password, String email) {
        return "";
    }

    @Override
    public AuthResponseDTO login(LoginDTO loginDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDTO.getEmail(),
                        loginDTO.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtGenerator.generateToken(authentication);
        Account user = accountRepos.findByEmail(loginDTO.getEmail()).get();
        return AuthResponseDTO
                .builder()
                .accessToken(token)
                .username(user.getEmail())
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
    public String loginWithGoogle(String token) {
        return "";
    }

    @Override
    public String loginWithFacebook(String token) {
        return "";
    }
}
