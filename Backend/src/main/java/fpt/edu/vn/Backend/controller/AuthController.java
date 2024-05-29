package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.AuthResponseDTO;
import fpt.edu.vn.Backend.DTO.LoginDTO;
import fpt.edu.vn.Backend.DTO.RegisterDTO;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.service.AuthService;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@CrossOrigin("*")
@RequestMapping("/auth")
@Slf4j
public class AuthController {

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
    public Map<String,Object> loginWithGoogle(OAuth2AuthenticationToken oAuth2AuthenticationToken)
    {
        return oAuth2AuthenticationToken.getPrincipal().getAttributes();
    }

    @PostMapping("login-with-facebook")
    public ResponseEntity<String> loginWithFacebook(@RequestBody String token) {
        return null;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@RequestBody RegisterDTO registerDTO) {
        return ResponseEntity.ok(authService.register(registerDTO));
    }
    @GetMapping("/auction-item/{id}")
    public String joinAuction(Model model, HttpSession session, @PathVariable int id) {
        if(session.getAttribute("account") == null) {
            return "login failed!";
        }
        model.addAttribute("auction_item", id);
        model.addAttribute("user_id", ((Account)session.getAttribute("account")).getAccountId());
        return "index";
    }
}
