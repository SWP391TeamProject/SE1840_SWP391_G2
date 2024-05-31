package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.ConsignmentDTO;
import fpt.edu.vn.Backend.DTO.ConsignmentDetailDTO;
import fpt.edu.vn.Backend.DTO.EvaluationDTO;
import fpt.edu.vn.Backend.service.AttachmentServiceImpl;
import fpt.edu.vn.Backend.service.ConsignmentDetailService;
import fpt.edu.vn.Backend.service.ConsignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
        ConsignmentDetailDTO consignmentDetailDTO = consignmentService.submitInitialEvaluation(evaluationDTO.getAccountId(), evaluationDTO.getEvaluation(), evaluationDTO.getPrice(), evaluationDTO.getConsignmentId());
        for(MultipartFile f: evaluationDTO.getFiles()){
            attachmentService.uploadConsignmentDetailAttachment(f, consignmentDetailDTO.getConsignmentDetailId());
        }
        return new ResponseEntity<>(consignmentDetailDTO, HttpStatus.OK);
    }
    @PostMapping("/createFinalEvaluation")
    public ResponseEntity<ConsignmentDetailDTO> createFinalEvaluation(@ModelAttribute EvaluationDTO evaluationDTO) {
        ConsignmentDetailDTO consignmentDetailDTO = consignmentService.submitFinalEvaluationUpdate(evaluationDTO.getAccountId(), evaluationDTO.getEvaluation(), evaluationDTO.getPrice(), evaluationDTO.getConsignmentId());
        for(MultipartFile f: evaluationDTO.getFiles()){
            attachmentService.uploadConsignmentDetailAttachment(f, consignmentDetailDTO.getConsignmentDetailId());
        }
        return new ResponseEntity<>(consignmentDetailDTO, HttpStatus.OK);
    }

    @PutMapping("/update/{consignmentDetailId}")
    public ResponseEntity<ConsignmentDetailDTO> updateConsignmentDetail(@PathVariable int consignmentDetailId, @RequestBody ConsignmentDetailDTO updatedConsignmentDetail) {
        return new ResponseEntity<>(consignmentDetailService.updateConsignmentDetail(consignmentDetailId,updatedConsignmentDetail), HttpStatus.OK);
    }

}
