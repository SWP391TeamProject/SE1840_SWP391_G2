package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.AuthResponseDTO;
import fpt.edu.vn.Backend.DTO.LoginDTO;
import fpt.edu.vn.Backend.DTO.RegisterDTO;
import fpt.edu.vn.Backend.oauth2.security.TokenProvider;
import fpt.edu.vn.Backend.oauth2.user.OAuth2UserInfo;
import fpt.edu.vn.Backend.exception.InvalidInputException;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.security.JWTGenerator;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@Service
@Slf4j
public class AuthServiceImpl implements AuthService{


    private final AccountRepos accountRepos;
    private final JWTGenerator jwtGenerator;
    private final AuthenticationManager authenticationManager;
    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);
    @Autowired
    public AuthServiceImpl(AccountRepos accountRepos, JWTGenerator jwtGenerator, AuthenticationManager authenticationManager) {
        this.accountRepos = accountRepos;
        this.jwtGenerator = jwtGenerator;
        this.authenticationManager = authenticationManager;
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
            newAccount.setRoles(Set.of(Account.Role.MEMBER));
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
                .roles(newAccount.getRoles())
                .build();
    }

    @Override
    public AuthResponseDTO login(LoginDTO loginDTO) {
        try {
            if (loginDTO.getEmail().isEmpty() || loginDTO.getPassword().isEmpty()) {
                throw new InvalidInputException("Email or password is empty!");
            }


            Optional<Account> userOptional = accountRepos.findByEmailAndPassword(loginDTO.getEmail(), loginDTO.getPassword());

            if (userOptional.isEmpty()) {
                throw new ResourceNotFoundException("Invalid email or password");
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
                    .roles(user.getRoles())
                    .build();
        }catch (Exception e){
            logger.error("An unexpected error occurred: " + e.getMessage(), e);
            return null;
        }
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
                .roles(user.getRoles())
                .build();
    }

    @Override
    public String loginWithFacebook(String token) {
        return "";
    }
}
