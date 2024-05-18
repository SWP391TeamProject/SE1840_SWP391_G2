package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.dto.AuthResponseDTO;
import fpt.edu.vn.Backend.dto.LoginDTO;
import fpt.edu.vn.Backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
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
        return ResponseEntity.ok(authService.login(loginDTO));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return null;
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody String email) {

        return null;
    }

    @PostMapping("login-with-google")
    public ResponseEntity<String> loginWithGoogle(@RequestBody String token) {
        return null;
    }

    @PostMapping("login-with-facebook")
    public ResponseEntity<String> loginWithFacebook(@RequestBody String token) {

        return null;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register() {
        return null;
    }
}
