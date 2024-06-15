package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.DepositDTO;
import fpt.edu.vn.Backend.DTO.request.DepositRequest;
import fpt.edu.vn.Backend.security.Authorizer;
import fpt.edu.vn.Backend.service.DepositService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/deposits")
@CrossOrigin("*")
public class DepositController {

    @Autowired
    private DepositService depositService;

    @PostMapping("/create")
    public ResponseEntity<DepositDTO> createDeposit(@RequestBody DepositRequest depositRequest) {
        DepositDTO createdDeposit = depositService.createDeposit(depositRequest);
        return ResponseEntity.ok(createdDeposit);
    }

    @GetMapping("/{depositId}")
    public ResponseEntity<DepositDTO> getDepositById(Principal principal, @PathVariable int depositId) {
        DepositDTO depositDTO = depositService.getDepositById(depositId);
        Authorizer.expectAdminOrUserId(principal, depositDTO.getPayment().getAccountId());
        return ResponseEntity.ok(depositDTO);
    }

    @GetMapping("/")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<DepositDTO>> getAllDeposits(@PageableDefault(size = 50) Pageable pageable) {
        Page<DepositDTO> deposits = depositService.getAllDeposits(pageable);
        return ResponseEntity.ok(deposits);
    }

}
