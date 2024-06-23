package fpt.edu.vn.Backend.controller;


import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("/api/kyc")
public class KycController {


    @PostMapping("/verify")
    public void verifyKyc() {
        // implementation here
    }


}
