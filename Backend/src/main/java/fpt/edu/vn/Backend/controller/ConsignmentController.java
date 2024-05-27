package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.ConsignmentDTO;
import fpt.edu.vn.Backend.DTO.ConsignmentDetailDTO;
import fpt.edu.vn.Backend.DTO.ConsignmentRequestDTO;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.service.AttachmentService;
import fpt.edu.vn.Backend.service.ConsignmentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import fpt.edu.vn.Backend.exception.ConsignmentServiceException;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/consignments")
@CrossOrigin("*")
public class ConsignmentController {
    private final ConsignmentService consignmentService;
    private static final Logger logger = LoggerFactory.getLogger(AccountController.class);
    @Autowired
    private AttachmentService attachmentService;
    @Autowired
    private AccountRepos accountRepos;

    @Autowired
    public ConsignmentController(ConsignmentService consignmentService) {
        this.consignmentService = consignmentService;
    }

    @GetMapping("/")
    public ResponseEntity<Page<ConsignmentDTO>> getAllConsignment(@RequestParam(defaultValue = "0") int pageNumb, @RequestParam(defaultValue = "50") int pageSize) {
        try {
            Page<ConsignmentDTO> consignments = consignmentService.getAllConsignments(pageNumb, pageSize);
            if(consignments == null || consignments.isEmpty()){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(consignments, HttpStatus.OK);
        } catch (Exception e) {
            // Log the exception
            logger.error("An error occurred while retrieving all consignments: {}", e.getMessage(), e);
            // Return error response
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Page<ConsignmentDTO>> getConsignmentByID(@PathVariable int id, @RequestParam(defaultValue = "0") int pageNumb, @RequestParam(defaultValue = "50") int pageSize) {
        try {
            Page<ConsignmentDTO> consignments = consignmentService.getConsignmentsByUserId(id, pageNumb, pageSize);
            if (consignments == null || consignments.isEmpty()) {
                throw new ConsignmentServiceException("No consignments found for user ID: " + id);
            }
            return new ResponseEntity<>(consignments, HttpStatus.OK);
        } catch (ConsignmentServiceException e) {
            logger.error("Error retrieving consignments by ID", e);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            logger.error("Unexpected error retrieving consignments by ID", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/filter-by-status")
    public ResponseEntity<Page<ConsignmentDTO>> getConsignmentByStatus(@RequestParam String status, @RequestParam(defaultValue = "0") int pageNumb, @RequestParam(defaultValue = "50") int pageSize) {
        try {
            Page<ConsignmentDTO> consignments = consignmentService.getConsignmentsByStatus(status, pageNumb, pageSize);
            if (consignments == null || consignments.isEmpty()) {
                throw new ConsignmentServiceException("No consignments found with status: " + status);
            }
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
            ConsignmentDetailDTO consignmentDetailDTO = new ConsignmentDetailDTO();
            consignmentDetailDTO.setAccountId(consignmentRequestDTO.getAccountId());
            consignmentDetailDTO.setDescription(consignmentRequestDTO.getDescription());
            int userId = consignmentDetailDTO.getAccountId(); // Hardcoded user ID for now
            ConsignmentDTO consignment = consignmentService.requestConsignmentCreate(userId,consignmentRequestDTO.getPreferContact(),consignmentDetailDTO);
            for(MultipartFile f: consignmentRequestDTO.getFiles()){
                attachmentService.uploadConsignmentDetailAttachment(f,consignment.getConsignmentDetails().stream().filter(x->x.getType().equals("REQUEST")).findFirst().get().getConsignmentDetailId() );
            }
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
    public ResponseEntity<String> approveFinalEvaluation(@PathVariable int consignmentId, @RequestParam int accountId, @RequestParam(defaultValue = "Approved By Manager") String description) {
        try {
            consignmentService.approveFinalEvaluation(consignmentId, accountId, description);
            return ResponseEntity.ok("Consignment approved successfully");
        } catch (ConsignmentServiceException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing consignment");
        }
    }
    @PostMapping("/rejected/{consignmentId}")
    public ResponseEntity<String> rejectFinalEvaluation(@PathVariable int consignmentId, @RequestParam int accountId, @RequestParam(defaultValue = "Rejected By Manager") String rejectReason) {
        try {
            consignmentService.rejectFinalEvaluation(consignmentId, accountId, rejectReason);
            return ResponseEntity.ok("Consignment rejected successfully");
        } catch (ConsignmentServiceException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing consignment");
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<ConsignmentDTO> deleteConsignment(@PathVariable int id) {
        return consignmentService.deleteConsignment(id);
    }



}
