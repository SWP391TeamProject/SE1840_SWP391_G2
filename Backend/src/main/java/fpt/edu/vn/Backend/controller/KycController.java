package fpt.edu.vn.Backend.controller;


import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.DTO.CitizenCardDTO;
import fpt.edu.vn.Backend.DTO.request.KycRequestDTO;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.security.Authorizer;
import fpt.edu.vn.Backend.security.JwtUser;
import fpt.edu.vn.Backend.service.KYCService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.Principal;

@RestController
@RequestMapping("/api/kyc")
public class KycController {
    @Autowired
    KYCService kycService;
    @PostMapping(value = "/verify",produces = "application/json")
    public ResponseEntity<CitizenCardDTO> verifyKyc(@ModelAttribute KycRequestDTO kycRequestDTO, Authentication authentication) throws IOException {
        // implementation heretr
            return ResponseEntity.ok(kycService.verifyKyc(kycRequestDTO, authentication));
    }

    @GetMapping(value = "/detail")
    public ResponseEntity<CitizenCardDTO> verifyKyc(Authentication authentication) {
        // implementation here
        CitizenCardDTO citizenCardDTO = kycService.kycDetail(authentication);
        return ResponseEntity.ok(citizenCardDTO);
    }

    @GetMapping(value = "/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN','MANAGER','STAFF')")
    public ResponseEntity<CitizenCardDTO> verifyKyc(@PathVariable Integer id) {
        return new ResponseEntity<>(kycService.getCitizenCardById(id), HttpStatus.OK);
    }

}
