package fpt.edu.vn.Backend.controller;


import fpt.edu.vn.Backend.DTO.request.KycRequestDTO;
import fpt.edu.vn.Backend.service.KYCService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/kyc")
public class KycController {
    @Autowired
    KYCService kycService;
    @PostMapping("/verify")
    public ResponseEntity verifyKyc(@ModelAttribute KycRequestDTO kycRequestDTO, Authentication authentication) {
        // implementation heretr
        try {
            kycService.verifyKyc(kycRequestDTO, authentication);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


}
