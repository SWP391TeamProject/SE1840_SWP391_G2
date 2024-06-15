package fpt.edu.vn.Backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/.well-known/")
public class DummyController {

    @GetMapping("acme-challenge/")
    public String dummy() {
        return "1234";
    }
}
