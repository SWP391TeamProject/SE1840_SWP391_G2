package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.*;
import fpt.edu.vn.Backend.DTO.request.ConsignmentDetailRequestDTO;
import fpt.edu.vn.Backend.exporter.ConsignmentDetailExporter;
import fpt.edu.vn.Backend.exporter.ConsignmentExporter;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.service.AccountService;
import fpt.edu.vn.Backend.service.AttachmentServiceImpl;
import fpt.edu.vn.Backend.service.ConsignmentDetailService;
import fpt.edu.vn.Backend.service.ConsignmentService;
import org.apache.tomcat.util.http.parser.Authorization;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/consignmentDetails")
@CrossOrigin("*")
public class ConsignmentDetailController {
    private final ConsignmentDetailService consignmentDetailService;
    @Autowired
    private ConsignmentService consignmentService;
    @Autowired
    private AttachmentServiceImpl attachmentService;
    @Autowired
    private AccountService accountService;

    @Autowired
    public ConsignmentDetailController(ConsignmentDetailService consignmentDetailService) {
        this.consignmentDetailService = consignmentDetailService;
    }

    @GetMapping("/{consignmentId}")
    public ResponseEntity<List<ConsignmentDetailDTO>> getConsignmentsDetailByConsignmentId(@PathVariable int consignmentId) {
        return new ResponseEntity<>(consignmentDetailService.getConsignmentsDetailByConsignmentId(consignmentId), HttpStatus.OK);
    }

    @GetMapping("/detail/{consignmentDetailId}")
    public ResponseEntity<ConsignmentDetailDTO> getConsignmentDetailById(@PathVariable int consignmentDetailId) {
        return new ResponseEntity<>(consignmentDetailService.getConsignmentDetailById(consignmentDetailId), HttpStatus.OK);
    }

    @PostMapping("/createInitialEvaluation")
    public ResponseEntity<ConsignmentDetailDTO> createInitialEvaluation(@ModelAttribute EvaluationDTO evaluationDTO) {
        AccountDTO account = accountService.getAccountById(evaluationDTO.getAccountId());
        ConsignmentDTO consignmentDTO = consignmentService.getConsignmentById(evaluationDTO.getConsignmentId());
        if(consignmentDTO == null || consignmentDTO.getStatus().equalsIgnoreCase("FINISHED")
                || consignmentDTO.getStatus().equalsIgnoreCase("TERMINATED")){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if(account == null || account.getRole() == Account.Role.MEMBER
        || !(account.getAccountId().equals(consignmentDTO.getStaff().getAccountId()) || account.getRole().equals(Account.Role.MANAGER))){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        ConsignmentDetailDTO consignmentDetailDTO = consignmentService.submitInitialEvaluation(evaluationDTO.getConsignmentId(), evaluationDTO.getEvaluation(), evaluationDTO.getPrice(), evaluationDTO.getAccountId());
        if (evaluationDTO.getFiles() != null) {
            for (MultipartFile f : evaluationDTO.getFiles()) {
                attachmentService.uploadConsignmentDetailAttachment(f, consignmentDetailDTO.getConsignmentDetailId());
            }
        }
        return new ResponseEntity<>(consignmentDetailDTO, HttpStatus.OK);
    }

    @PostMapping("/createFinalEvaluation")
    public ResponseEntity<ConsignmentDetailDTO> createFinalEvaluation(@ModelAttribute EvaluationDTO evaluationDTO) {
        ConsignmentDetailDTO consignmentDetailDTO = consignmentService.submitFinalEvaluationUpdate(evaluationDTO.getConsignmentId(), evaluationDTO.getEvaluation(), evaluationDTO.getPrice(), evaluationDTO.getAccountId());
        List<AttachmentDTO> list = new ArrayList<>();
        if (evaluationDTO.getFiles() != null) {
            for (MultipartFile f : evaluationDTO.getFiles()) {
                list.add(attachmentService.uploadConsignmentDetailAttachment(f, consignmentDetailDTO.getConsignmentDetailId()));
            }
        }
        consignmentDetailDTO.setAttachments(list);
        return new ResponseEntity<>(consignmentDetailDTO, HttpStatus.OK);
    }

    @PostMapping("/create")
    public ResponseEntity<ConsignmentDetailDTO> createConsignmentDetail(@RequestBody ConsignmentDetailRequestDTO consignmentRequestDetailDTO) {
        return new ResponseEntity<>(consignmentDetailService.createConsignmentDetail(consignmentRequestDetailDTO), HttpStatus.CREATED);
    }

    @PostMapping("/update/{consignmentDetailId}")
    public ResponseEntity<ConsignmentDetailDTO> updateConsignmentDetail(@PathVariable int consignmentDetailId, @RequestBody ConsignmentDetailRequestDTO consignmentRequestDetailDTO) {
        return new ResponseEntity<>(consignmentDetailService.updateConsignmentDetail(consignmentDetailId, consignmentRequestDetailDTO), HttpStatus.OK);
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportToExcel(Authentication authentication) {
        AccountDTO account = accountService.getAccountByEmail(authentication.getName());
        if (account == null || account.getRole() != Account.Role.ADMIN){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        List<ConsignmentDetailDTO> consignmentDetailDTOS;
        {
            consignmentDetailDTOS = consignmentDetailService.getAllConsignmentsDetail( Pageable.ofSize(1000)).toList();
        }

        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
        String currentDateTime = dateFormatter.format(new Date());

        String headerValue = "filename=consignments_" + currentDateTime + ".xlsx";

        ConsignmentDetailExporter excelExporter = new ConsignmentDetailExporter(consignmentDetailDTOS);

        return ResponseEntity.ok()
                .header("Content-Disposition", headerValue)
                .body(excelExporter.export().toByteArray());
    }
}
