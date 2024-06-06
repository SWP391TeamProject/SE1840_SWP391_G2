package fpt.edu.vn.Backend.controller;

import com.nimbusds.jose.JOSEException;
import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.DTO.AuthResponseDTO;
import fpt.edu.vn.Backend.DTO.LoginDTO;
import fpt.edu.vn.Backend.DTO.RegisterDTO;
import fpt.edu.vn.Backend.DTO.request.AccountActivationRequestDTO;
import fpt.edu.vn.Backend.DTO.request.IntrospectRequest;
import fpt.edu.vn.Backend.DTO.request.LogOutRequest;
import fpt.edu.vn.Backend.DTO.request.ResetPasswordRequestDTO;
import fpt.edu.vn.Backend.DTO.response.IntrospectResponse;
import fpt.edu.vn.Backend.exception.CooldownException;
import fpt.edu.vn.Backend.exception.ErrorResponse;
import fpt.edu.vn.Backend.oauth2.response.ApiResponse;
import fpt.edu.vn.Backend.oauth2.security.TokenProvider;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.service.AuthService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@CrossOrigin("*")
@RequestMapping("/auth")
@Slf4j
public class AuthController {

    private final AuthService authService;
    @Autowired
    private TokenProvider tokenProvider;
    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginDTO loginDTO) {
        AuthResponseDTO authResponseDTO = authService.login(loginDTO);
        return ResponseEntity.ok(authResponseDTO);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody LogOutRequest logOutRequest)
            throws ParseException, JOSEException {
        authService.logout(logOutRequest);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/introspect")
    public ResponseEntity<IntrospectResponse> isAuthenticate(@RequestBody IntrospectRequest request)
            throws ParseException, JOSEException {
        boolean result = tokenProvider.introspect(request).isValid();
        IntrospectResponse introspectResponse = IntrospectResponse.builder().valid(result).build();
        return ResponseEntity.ok(introspectResponse);
    }

    @GetMapping("/login-with-google")
    public ResponseEntity<AuthResponseDTO> loginWithGoogle(@RequestParam(required = false) String token) {
        AuthResponseDTO authResponseDTO = authService.loginWithGoogle(token);
        return ResponseEntity.ok(authResponseDTO);
    }

    @GetMapping("/login-with-facebook")
    public ResponseEntity<AuthResponseDTO> loginWithFacebook(@RequestParam String token) {
        AuthResponseDTO authResponseDTO = authService.loginWithFacebook(token);
        return ResponseEntity.ok(authResponseDTO);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@RequestBody RegisterDTO registerDTO) {
        return ResponseEntity.ok(authService.register(registerDTO));
    }

    @GetMapping("/auction-item/{id}")
    public String joinAuction(Model model, HttpSession session, @PathVariable int id) {
        if (session.getAttribute("account") == null) {
            return "login failed!";
        }
        model.addAttribute("auction_item", id);
        model.addAttribute("user_id", ((Account) session.getAttribute("account")).getAccountId());
        return "index";
    }

    @PostMapping("/request-reset-password/")
    public ResponseEntity<?> requestResetPassword(@RequestBody ResetPasswordRequestDTO dto) {
        try {
            authService.requestResetPassword(dto.getEmail());
        } catch (MessagingException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/reset-password/")
    public ResponseEntity<?> resetPassword(@RequestParam String newPassword,
                                                    @RequestParam String code) {
        if (!authService.confirmResetPassword(code, newPassword)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/request-activate-account/")
    public ResponseEntity<?> requestActivatePassword(@RequestBody AccountActivationRequestDTO dto) {
        try {
            authService.requestActivateAccount(dto.getEmail());
        } catch (MessagingException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (IllegalAccessException e) {
            throw new CooldownException(e);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/activate-account/")
    public ResponseEntity<?> activateAccount(@RequestParam String code) {
        if (!authService.confirmActivateAccount(code)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
