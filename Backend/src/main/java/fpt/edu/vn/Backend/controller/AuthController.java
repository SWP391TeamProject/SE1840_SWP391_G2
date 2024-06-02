package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.DTO.AuthResponseDTO;
import fpt.edu.vn.Backend.DTO.LoginDTO;
import fpt.edu.vn.Backend.DTO.RegisterDTO;
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

@RestController
@CrossOrigin("*")
@RequestMapping("/auth")
@Slf4j
public class AuthController {

    private final AuthService authService;

    @Autowired
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
    public ResponseEntity<AuthResponseDTO> loginWithGoogle(@RequestParam(required = false) String token) {
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

    @PostMapping("/request-reset-password/")
    public ResponseEntity<AccountDTO> requestResetPassword(@RequestParam int id) {
        try {
            authService.requestResetPassword(id);
        } catch (MessagingException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/reset-password/")
    public ResponseEntity<AccountDTO> resetPassword(@RequestParam String newPassword,
                                                    @RequestParam String code) {
        if (!authService.confirmResetPassword(code, newPassword)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
