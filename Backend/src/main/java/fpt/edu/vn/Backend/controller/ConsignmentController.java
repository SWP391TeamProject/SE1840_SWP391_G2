package fpt.edu.vn.Backend.controller;



import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.DTO.ConsignmentDTO;
import fpt.edu.vn.Backend.DTO.ConsignmentDetailDTO;
import fpt.edu.vn.Backend.DTO.request.ConsignmentRequestDTO;
import fpt.edu.vn.Backend.DTO.request.UpdateConsignmentStatusRequestDTO;
import fpt.edu.vn.Backend.exception.ConsignmentServiceException;
import fpt.edu.vn.Backend.exporter.ConsignmentExporter;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.Consignment;
import fpt.edu.vn.Backend.security.Authorizer;
import fpt.edu.vn.Backend.security.JwtUser;
import fpt.edu.vn.Backend.service.AccountService;
import fpt.edu.vn.Backend.service.AttachmentService;
import fpt.edu.vn.Backend.service.ConsignmentService;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/consignments")
@CrossOrigin("*")
public class ConsignmentController {
    private final ConsignmentService consignmentService;
    private static final Logger logger = LoggerFactory.getLogger(ConsignmentController.class);
    @Autowired
    private AttachmentService attachmentService;
    @Autowired
    private AccountService accountService;

    @Autowired
    public ConsignmentController(ConsignmentService consignmentService) {
        this.consignmentService = consignmentService;
    }

    @GetMapping("/")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'MANAGER')")
    public ResponseEntity<Page<ConsignmentDTO>> getAllConsignment(
            Principal principal,
            @PageableDefault(size = 50) Pageable pageable,
            @RequestParam(required = false) Consignment.Status status,
            @RequestParam(required = false) LocalDateTime from,
            @RequestParam(required = false) LocalDateTime to,
            @RequestParam(required = false) Integer customer,
            @RequestParam(required = false) String search) {
        JwtUser requester = Authorizer.requireUser(principal);
        if (!Authorizer.STAFF.contains(requester.getRole())) {
            customer = requester.getUserId(); // only get consignment of current user
        }
        if (requester.getRole() == Account.Role.STAFF) {
            return ResponseEntity.ok(consignmentService.getAllConsignments(
                    pageable, status, from, to, customer, requester.getUserId(), search));
        }
        return ResponseEntity.ok(consignmentService.getAllConsignments(
                pageable, status, from, to, customer, null, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConsignmentDTO> getConsignmentByID(Principal principal, @PathVariable int id) {
        try {
            ConsignmentDTO consignment = consignmentService.getConsignmentById(id);
            if (consignment == null) {
                throw new ConsignmentServiceException("No consignments found for acc ID: " + id);
            }
            Authorizer.expectStaffOrUserId(principal, consignment.getUser().getAccountId());
            return new ResponseEntity<>(consignment, HttpStatus.OK);
        } catch (ConsignmentServiceException e) {
            logger.error("Error retrieving consignments by ID", e);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            logger.error("Unexpected error retrieving consignments by ID", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/secret/{code}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'MANAGER')")
    public ResponseEntity<ConsignmentDTO> getConsignmentBySecretCode(Principal principal,
                                                                     @PathVariable String code) {
        ConsignmentDTO consignment = consignmentService.getConsignmentBySecretCode(code);
        if (consignment == null) {
            throw new ConsignmentServiceException("No consignments found for code: " + code);
        }
        JwtUser requester = Authorizer.requireUser(principal);
        if (requester.getRole() == Account.Role.STAFF &&
                requester.getUserId() != consignment.getStaff().getAccountId()) {
            throw new ConsignmentServiceException("You have no permission to view this consignment!");
        }
        return new ResponseEntity<>(consignment, HttpStatus.OK);
    }


    @GetMapping("/user/{id}")
    public ResponseEntity<Page<ConsignmentDTO>> getConsignmentByUserID(
            @PathVariable int id,
            @PageableDefault(size = 50) Pageable pageable,Authentication authentication) {
        AccountDTO acc = accountService.getAccountByEmail(authentication.getName());
        if(acc == null || acc.getAccountId() != id){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        try {
//            if (consignments == null || consignments.isEmpty()) {
//                throw new ConsignmentServiceException("No consignments found for user ID: " + id);
//            }
            return new ResponseEntity<>(consignmentService.getConsignmentsByUserId(id, pageable), HttpStatus.OK);
        } catch (ConsignmentServiceException e) {
            logger.error("Error retrieving consignments by ID", e);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            logger.error("Unexpected error retrieving consignments by ID", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/filter-by-status")
    public ResponseEntity<Page<ConsignmentDTO>> getConsignmentByStatus(
            @RequestParam String status,
            @PageableDefault(size = 50) Pageable pageable,
            Authentication authentication) {
        logger.info("Filtering consignments by status: " + pageable.toString());
        try {
            AccountDTO acc = accountService.getAccountByEmail(authentication.getName());
            if (acc == null) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
            Page<ConsignmentDTO> consignments = consignmentService.getConsignmentsByStatus(status, pageable, acc.getAccountId());
            return new ResponseEntity<>(consignments, HttpStatus.OK);
        } catch (ConsignmentServiceException e) {
            logger.error("Error retrieving consignments by status", e);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            logger.error("Unexpected error retrieving consignments by status", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<ConsignmentDTO> createConsignment(@ModelAttribute ConsignmentRequestDTO consignmentRequestDTO) {
        try {
            ConsignmentDTO consignment = consignmentService.requestConsignmentCreate(consignmentRequestDTO);

            return new ResponseEntity<>(consignment, HttpStatus.CREATED);
        } catch (ConsignmentServiceException e) {
            logger.error("Error creating consignment", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/confirm/{consignmentId}")
    public ResponseEntity<String> confirmJewelryReceived(@PathVariable int consignmentId) {
        try {
            consignmentService.confirmJewelryReceived(consignmentId);
            return ResponseEntity.ok("Jewelry received confirmed.");
        } catch (IllegalArgumentException | IllegalStateException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/approve/{consignmentId}")
    public ResponseEntity<ConsignmentDTO> approveFinalEvaluation(@PathVariable int consignmentId, @RequestParam int accountId, @RequestParam(defaultValue = "Approved By Manager") String description) {
        return ResponseEntity.ok(consignmentService.approveFinalEvaluation(consignmentId, accountId, description));
    }

    @PostMapping("/reject/{consignmentId}")
    public ResponseEntity<ConsignmentDTO> rejectFinalEvaluation(@PathVariable int consignmentId, @RequestParam("accountId") int accountId, @RequestParam(defaultValue = "Rejected By Manager", name = "reason") String rejectReason) {
        return ResponseEntity.ok(consignmentService.rejectFinalEvaluation(consignmentId, accountId, rejectReason));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<ConsignmentDTO> deleteConsignment(@PathVariable int id) {
        return consignmentService.deleteConsignment(id);
    }

    @PutMapping("/take/{consignmentId}")
    public ResponseEntity<ConsignmentDTO> takeConsignment(@PathVariable int consignmentId, @RequestBody int accountId) {
        logger.info("Taking consignment with ID: " + consignmentId + " by Account ID: " + accountId);
        return new ResponseEntity<>(consignmentService.takeConsignment(consignmentId, accountId), HttpStatus.OK);
    }

    @GetMapping("/received/{consignmentId}")
    public ResponseEntity<ConsignmentDTO> receivedConsignment(@PathVariable int consignmentId) {
        return new ResponseEntity<>(consignmentService.receivedConsignment(consignmentId), HttpStatus.OK);
    }

    //Customer
    @GetMapping("/acceptIniEva/{consignmentDetailId}")
    public ResponseEntity<ConsignmentDTO> acceptInitialEvaluation(@PathVariable int consignmentDetailId) {
        return new ResponseEntity<>(consignmentService.custAcceptInitialEvaluation(consignmentDetailId), HttpStatus.OK);
    }

    @GetMapping("/rejectIniEva/{consignmentDetailId}")
    public ResponseEntity<ConsignmentDTO> rejectInitialEvaluation(@PathVariable int consignmentDetailId) {
        return new ResponseEntity<>(consignmentService.custRejectInitialEvaluation(consignmentDetailId), HttpStatus.OK);
    }

    @GetMapping("/acceptFinalEva/{consignmentDetailId}")
    public ResponseEntity<ConsignmentDTO> acceptFinalEvaluation(@PathVariable int consignmentDetailId) {
        return new ResponseEntity<>(consignmentService.custAcceptFinaltialEvaluation(consignmentDetailId), HttpStatus.OK);
    }

    @GetMapping("/rejectFinalEva/{consignmentDetailId}")
    public ResponseEntity<ConsignmentDTO> rejectFinalEvaluation(@PathVariable int consignmentDetailId) {
        return new ResponseEntity<>(consignmentService.custRejectFinaltialEvaluation(consignmentDetailId), HttpStatus.OK);
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportToExcel(Authentication authentication) {
        AccountDTO account = accountService.getAccountByEmail(authentication.getName());
        if (account == null || account.getRole() != Account.Role.ADMIN){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        List<ConsignmentDTO> listConsignments;
        String keyword = "";
        {
            listConsignments = consignmentService.getAllConsignments(keyword,Pageable.ofSize(1000)).toList();
        }

        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
        String currentDateTime = dateFormatter.format(new Date());

        String headerValue = "filename=consignments_" + currentDateTime + ".xlsx";

        ConsignmentExporter excelExporter = new ConsignmentExporter(listConsignments);

        return ResponseEntity.ok()
                .header("Content-Disposition", headerValue)
                .body(excelExporter.export().toByteArray());
    }

    @PostMapping("/updateStatus")
    public ResponseEntity<Void> updateConsignmentStatus(@RequestBody(required = false) UpdateConsignmentStatusRequestDTO consignmentDTOList) {
        consignmentService.updateConsignmentByStatus(consignmentDTOList);
        return ResponseEntity.ok().build();
    }

}
