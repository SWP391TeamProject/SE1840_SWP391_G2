package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.AuthResponseDTO;
import fpt.edu.vn.Backend.DTO.LoginDTO;
import fpt.edu.vn.Backend.DTO.RegisterDTO;
import fpt.edu.vn.Backend.oauth2.response.AuthResponse;
import fpt.edu.vn.Backend.oauth2.security.CookieUtils;
import fpt.edu.vn.Backend.oauth2.security.TokenProvider;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;
import java.util.Optional;


@RestController
@CrossOrigin("*")
@RequestMapping("/auth")
@Slf4j
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private AccountRepos accountRepos;


    private final AuthService authService;
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Handles the login request.
     *
     * @param loginDTO The password of the user trying to log in.
     * @return A ResponseEntity with the login status.
     * @author Vi LE
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginDTO loginDTO) {
        AuthResponseDTO authResponseDTO = authService.login(loginDTO);
        return ResponseEntity.ok(authResponseDTO);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return null;
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody String email) {

        return null;
    }

    @GetMapping("/login-with-google")
    public ResponseEntity<AuthResponseDTO> loginWithGoogle(@RequestParam String token) {
        AuthResponseDTO authResponseDTO = authService.loginWithGoogle(token);
        return ResponseEntity.ok(authResponseDTO);
//        return ResponseEntity.ok(new AuthResponse(token));
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

}
