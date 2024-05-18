package fpt.edu.vn.Backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController("/auth")
public class AuthController {

    /**
     * Handles the login request.
     *
     * @param username The username of the user trying to log in.
     * @param password The password of the user trying to log in.
     * @return A ResponseEntity with the login status.
     * @author Vi LE
     */
    @PostMapping("/login")
    public ResponseEntity<String> loginWithUserNameAndPassword(@RequestBody String username, @RequestBody String password) {
        return ResponseEntity.ok("Login successful");
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
