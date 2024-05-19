package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.service.AccountServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller("/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    @Autowired
    private AccountServiceImpl accountService;
    /**
     * Handles the login request.
     *
     * @param username The username of the user trying to log in.
     * @param password The password of the user trying to log in.
     * @return A ResponseEntity with the login status.
     * @author Vi LE
     */
    @PostMapping("/login")
    public ResponseEntity<String> loginWithUserNameAndPassword(@RequestParam String username, @RequestParam String password, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(accountService.getAccountByEmailAndPassword(username, password) == null) {
            return ResponseEntity.badRequest().body("Login failed");
        }
        session.setAttribute("account", accountService.getAccountByEmail(username));
        return ResponseEntity.ok("Login successful");
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        log.info(((Account)session.getAttribute("account")).getNickname() + " logged out.");
        session.invalidate();
        return ResponseEntity.ok("Logged out");
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
    @GetMapping("/auction-item/{id}")
    public String joinAuction(Model model, HttpSession session, @PathVariable int id) {
        if(session.getAttribute("account") == null) {
            return "login failed!";
        }
        model.addAttribute("auction_item", id);
        model.addAttribute("user_id", ((Account)session.getAttribute("account")).getUserId());
        return "index";
    }
}
