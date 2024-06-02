package fpt.edu.vn.Backend.serviceTest;

import fpt.edu.vn.Backend.DTO.AuthResponseDTO;
import fpt.edu.vn.Backend.DTO.LoginDTO;
import fpt.edu.vn.Backend.DTO.RegisterDTO;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.security.JWTGenerator;
import fpt.edu.vn.Backend.service.AuthServiceImpl;
import jakarta.mail.MessagingException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

@Nested
class AuthServiceImplTest {

    @InjectMocks
    private AuthServiceImpl authService;

    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private JWTGenerator jwtGenerator;
    @Mock
    private AccountRepos accountRepos;
    @Mock
    private JavaMailSender mailSender;
    @Mock
    private MimeMessageHelper mimeMessageHelper;

    @BeforeEach
    public void setup() throws MessagingException {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Should login successfully when valid email and password are provided")
    public void shouldLoginSuccessfullyWhenValidEmailAndPasswordAreProvided() {
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail("test@test.com");
        loginDTO.setPassword("password");

        Authentication authentication = new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword());
        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(jwtGenerator.generateToken(any())).thenReturn("someToken");

        Account account = new Account();
        account.setEmail("test@test.com");
        account.setRole(Account.Role.MEMBER);
        when(accountRepos.findByEmailAndPassword(anyString(), anyString())).thenReturn(Optional.of(account));
        AuthResponseDTO result = authService.login(loginDTO);

        assertNotNull(result);
        assertEquals("test@test.com", result.getEmail());
    }

    @Test
    @DisplayName("Should throw RuntimeException when email is empty")
    public void shouldThrowRuntimeExceptionWhenEmailIsEmpty() {
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail("");
        loginDTO.setPassword("password");

        assertThrows(RuntimeException.class, () -> authService.login(loginDTO));
    }

    @Test
    @DisplayName("Should throw RuntimeException when password is empty")
    public void shouldThrowRuntimeExceptionWhenPasswordIsEmpty() {
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail("test@test.com");
        loginDTO.setPassword("");

        assertThrows(RuntimeException.class, () -> authService.login(loginDTO));
    }


//    @Test
//    @DisplayName("Should register successfully when valid email and password are provided")
//    public void shouldRegisterSuccessfullyWhenValidEmailAndPasswordAreProvided() throws MessagingException {
//        RegisterDTO registerDTO = new RegisterDTO();
//        registerDTO.setEmail("test@test.com");
//        registerDTO.setPassword("password");
//        registerDTO.setConfirmPassword("password");
//
//        Account account = new Account();
//        account.setEmail(registerDTO.getEmail());
//        account.setPassword(registerDTO.getPassword());
//        account.setRole(Account.Role.MEMBER);
//
//        when(accountRepos.findByEmail(anyString())).thenReturn(Optional.empty());
//        when(accountRepos.save(any(Account.class))).thenReturn(account);
//        when(authenticationManager.authenticate(any())).thenReturn(new UsernamePasswordAuthenticationToken(registerDTO.getEmail(), registerDTO.getPassword()));
//        when(jwtGenerator.generateToken(any())).thenReturn("someToken");
//
//        AuthResponseDTO result = authService.register(registerDTO);
//
//        assertNotNull(result);
//        assertEquals("test@test.com", result.getEmail());
//    }

    @Test
    @DisplayName("Should throw RuntimeException when email is empty in registration")
    public void shouldThrowRuntimeExceptionWhenEmailIsEmptyInRegistration() {
        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.setEmail("");
        registerDTO.setPassword("password");
        registerDTO.setConfirmPassword("password");

        assertThrows(RuntimeException.class, () -> authService.register(registerDTO));
    }

    @Test
    @DisplayName("Should throw RuntimeException when password is empty in registration")
    public void shouldThrowRuntimeExceptionWhenPasswordIsEmptyInRegistration() {
        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.setEmail("test@test.com");
        registerDTO.setPassword("");
        registerDTO.setConfirmPassword("");

        assertThrows(RuntimeException.class, () -> authService.register(registerDTO));
    }

    @Test
    @DisplayName("Should throw RuntimeException when password and confirm password do not match")
    public void shouldThrowRuntimeExceptionWhenPasswordAndConfirmPasswordDoNotMatch() {
        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.setEmail("test@test.com");
        registerDTO.setPassword("password");
        registerDTO.setConfirmPassword("differentPassword");

        assertThrows(RuntimeException.class, () -> authService.register(registerDTO));
    }

    @Test
    @DisplayName("Should throw RuntimeException when password is too short")
    public void shouldThrowRuntimeExceptionWhenPasswordIsTooShort() {
        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.setEmail("test@test.com");
        registerDTO.setPassword("short");
        registerDTO.setConfirmPassword("short");

        assertThrows(RuntimeException.class, () -> authService.register(registerDTO));
    }

    @Test
    @DisplayName("Should throw RuntimeException when email already exists")
    public void shouldThrowRuntimeExceptionWhenEmailAlreadyExists() {
        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.setEmail("test@test.com");
        registerDTO.setPassword("password");
        registerDTO.setConfirmPassword("password");

        when(accountRepos.findByEmail(anyString())).thenReturn(Optional.of(new Account()));

        assertThrows(RuntimeException.class, () -> authService.register(registerDTO));
    }

    @Test
    @DisplayName("Should return accessToken when user logged in successfully")
    public void shouldReturnAccessTokenWhenUserLoggedInSuccessfully() {
        // Arrange
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail("sdfsdf@sda.cc");
        loginDTO.setPassword("password");

        Authentication authentication = new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword());
        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(jwtGenerator.generateToken(any())).thenReturn("someToken");

        Account account = new Account();
        account.setEmail("sdfsdf@sda.cc");
        account.setPassword("password");
        account.setRole(Account.Role.MEMBER);
        when(accountRepos.findByEmailAndPassword(anyString(), anyString())).thenReturn(Optional.of(account));

        // Act
        AuthResponseDTO result = authService.login(loginDTO);

        // Assert
        assertNotNull(result);
        assertNotNull(result.getAccessToken());
        System.out.println(result.getAccessToken());
        assertEquals("someToken", result.getAccessToken());
    }
}