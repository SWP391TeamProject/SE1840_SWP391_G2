package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.DepositDTO;
import fpt.edu.vn.Backend.service.DepositService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/deposits")
@CrossOrigin("*")
public class DepositController {

    @Autowired
    private DepositService depositService;

    @PostMapping("/create")
    public ResponseEntity<DepositDTO> createDeposit(@RequestBody DepositDTO depositDTO) {
        DepositDTO createdDeposit = depositService.createDeposit(depositDTO);
        return ResponseEntity.ok(createdDeposit);
    }

    @GetMapping("/{depositId}")
    public ResponseEntity<DepositDTO> getDepositById(@PathVariable int depositId) {
        DepositDTO depositDTO = depositService.getDepositById(depositId);
        return ResponseEntity.ok(depositDTO);
    }

    @GetMapping("/")
    public ResponseEntity<Page<DepositDTO>> getAllDeposits(@RequestParam(defaultValue = "0") int pageNumb,@RequestParam(defaultValue = "50") int pageSize) {
        Pageable pageable = PageRequest.of(pageNumb,pageSize);
        Page<DepositDTO> deposits = depositService.getAllDeposits(pageable);
        return ResponseEntity.ok(deposits);
    }

    @PostMapping("/update/{depositId}")
    public ResponseEntity<DepositDTO> updateDeposit(@PathVariable int depositId, @RequestBody DepositDTO depositDTO) {
        DepositDTO updatedDeposit = depositService.updateDeposit(depositId, depositDTO);
        return ResponseEntity.ok(updatedDeposit);
    }

    @PostMapping("/delete/{depositId}")
    public ResponseEntity<Void> deleteDeposit(@PathVariable int depositId) {
        depositService.deleteDeposit(depositId);
        return ResponseEntity.noContent().build();
    }
}
