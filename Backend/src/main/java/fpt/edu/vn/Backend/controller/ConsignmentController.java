package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.AccountAdminDTO;
import fpt.edu.vn.Backend.DTO.ConsignmentDTO;
import fpt.edu.vn.Backend.service.AccountService;
import fpt.edu.vn.Backend.service.ConsignmentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import fpt.edu.vn.Backend.exception.ConsignmentServiceException;
import java.util.List;

@RestController
@RequestMapping("/api/consignments")
public class ConsignmentController {
    private final ConsignmentService consignmentService;
    private static final Logger logger = LoggerFactory.getLogger(AccountController.class);
    @Autowired
    public ConsignmentController(ConsignmentService consignmentService) {
        this.consignmentService = consignmentService;
    }

    @GetMapping("/")
    public ResponseEntity<List<ConsignmentDTO>> getAllConsignment(@RequestParam(defaultValue = "0") int pageNumb, @RequestParam(defaultValue = "50") int pageSize) {
        try {
            List<ConsignmentDTO> consignments = consignmentService.getAllConsignments(pageNumb, pageSize);
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
    public ResponseEntity<List<ConsignmentDTO>> getConsignmentByID(@PathVariable int id, @RequestParam(defaultValue = "0") int pageNumb, @RequestParam(defaultValue = "50") int pageSize) {
        try {
            List<ConsignmentDTO> consignments = consignmentService.getConsignmentsByUserId(id, pageNumb, pageSize);
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
    public ResponseEntity<List<ConsignmentDTO>> getConsignmentByStatus(@RequestParam String status, @RequestParam(defaultValue = "0") int pageNumb, @RequestParam(defaultValue = "50") int pageSize) {
        try {
            List<ConsignmentDTO> consignments = consignmentService.getConsignmentsByStatus(status, pageNumb, pageSize);
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


}
