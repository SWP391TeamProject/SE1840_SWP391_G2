package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.dto.AuthResponseDTO;
import fpt.edu.vn.Backend.dto.LoginDTO;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.Role;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.security.JWTGenerator;
import org.springframework.beans.factory.annotation.Autowired;
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
    private final JWTGenerator jwtGenerator;
    private final AuthenticationManager authenticationManager;
    @Autowired
    public AuthServiceImpl(AccountRepos accountRepos, JWTGenerator jwtGenerator, AuthenticationManager authenticationManager) {
        this.accountRepos = accountRepos;
        this.jwtGenerator = jwtGenerator;
        this.authenticationManager = authenticationManager;
    }



    @Override
    public AuthResponseDTO register(String email, String password) {
        Account newAccount ;
        try {
            accountRepos.findByEmail(email).ifPresent(account -> {
                throw new IllegalStateException("Email already exists! try login instead.");
            });
            newAccount = new Account();
            newAccount.setEmail(email);
            newAccount.setPassword(password); // Consider hashing the password before saving
            newAccount = accountRepos.save(newAccount);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        // After successful registration, log the user in and generate a token
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        email,
                        password
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtGenerator.generateToken(authentication);

        return AuthResponseDTO.builder()
                .accessToken(token)
                .username(newAccount.getEmail())
                .build();
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
                .role(user.getAuthorities().stream().max(Comparator.comparingInt(Role::getRoleId)).get().getRoleName())
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
