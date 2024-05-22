package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.AuthResponseDTO;
import fpt.edu.vn.Backend.DTO.LoginDTO;
import fpt.edu.vn.Backend.DTO.RegisterDTO;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.Role;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.RoleRepos;
import fpt.edu.vn.Backend.security.JWTGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.HashSet;
import java.util.Set;

@Service

public class AuthServiceImpl implements AuthService{


    private final AccountRepos accountRepos;
    private final JWTGenerator jwtGenerator;
    private final AuthenticationManager authenticationManager;
    private final RoleRepos roleRepos;

    @Autowired
    public AuthServiceImpl(AccountRepos accountRepos, JWTGenerator jwtGenerator, AuthenticationManager authenticationManager, RoleRepos roleRepos) {
        this.accountRepos = accountRepos;
        this.jwtGenerator = jwtGenerator;
        this.authenticationManager = authenticationManager;
        this.roleRepos = roleRepos;
    }



    @Override
    public AuthResponseDTO register(RegisterDTO registerDTO) {
        Account newAccount ;
        try {
            if(registerDTO.getEmail().isEmpty() || registerDTO.getPassword().isEmpty()){
                throw new IllegalStateException("Email or password is empty!");
            }

            if (!registerDTO.getPassword().equals(registerDTO.getConfirmPassword())) {
                throw new IllegalStateException("Password and confirm password do not match!");
            }

            if (registerDTO.getPassword().length() < 6) {
                throw new IllegalStateException("Password is too short!");
            }

            accountRepos.findByEmail(registerDTO.getEmail()).ifPresent(account -> {
                throw new IllegalStateException("Email already exists! try login instead.");
            });
            Set<Role> roles = new HashSet<>();
            roleRepos.findById(1).ifPresent(roles::add);
            newAccount = new Account();
            newAccount.setEmail(registerDTO.getEmail());
            newAccount.setPassword(registerDTO.getPassword()); // Consider hashing the password before saving
            newAccount.setAuthorities(roles);
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
                .username(newAccount.getEmail())
                .build();
    }

    @Override
    public AuthResponseDTO login(LoginDTO loginDTO) {
        if(loginDTO.getEmail().isEmpty() || loginDTO.getPassword().isEmpty()){
            throw new IllegalStateException("Email or password is empty!");
        }

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
                .username(user.getNickname())
                .email(user.getEmail())
                .role(String.valueOf(user.getAuthorities().stream().max(Comparator.comparingInt(Role::getRoleId)).get().getRoleName()))
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
