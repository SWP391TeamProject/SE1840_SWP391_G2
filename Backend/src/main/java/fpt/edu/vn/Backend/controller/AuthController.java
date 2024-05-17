package fpt.edu.vn.Backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController("/auth")
public class AuthController {
    @PostMapping("/login")
    public ResponseEntity<String> login() {
        return null;
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
    public ResponseEntity<String> loginWithGoogle() {

        return null;


    }

    @PostMapping("login-with-facebook")
    public ResponseEntity<String> loginWithFacebook() {

        return null;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register() {
        return null;
    }
}
