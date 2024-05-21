package fpt.edu.vn.Backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ping")
@CrossOrigin("*")

public class PingController {
    @GetMapping("/")
    public ResponseEntity<String> onPing() {
        return new ResponseEntity<>("Pong!", HttpStatus.OK);
    }
}
