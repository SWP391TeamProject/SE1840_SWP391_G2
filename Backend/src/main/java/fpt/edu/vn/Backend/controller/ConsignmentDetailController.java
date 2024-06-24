package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.ConsignmentDetailDTO;
import fpt.edu.vn.Backend.DTO.EvaluationDTO;
import fpt.edu.vn.Backend.DTO.request.ConsignmentDetailRequestDTO;
import fpt.edu.vn.Backend.exporter.ConsignmentDetailExporter;
import fpt.edu.vn.Backend.service.AttachmentServiceImpl;
import fpt.edu.vn.Backend.service.ConsignmentDetailService;
import fpt.edu.vn.Backend.service.ConsignmentService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Comparator;
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
        if (evaluationDTO.getFiles() != null) {
            for (MultipartFile f : evaluationDTO.getFiles()) {
                attachmentService.uploadConsignmentDetailAttachment(f, consignmentDetailDTO.getConsignmentDetailId());
            }
        }
        return new ResponseEntity<>(consignmentDetailDTO, HttpStatus.OK);
    }

    @PostMapping("/create")
    public ResponseEntity<ConsignmentDetailDTO> createConsignmentDetail(@RequestBody ConsignmentDetailRequestDTO consignmentRequestDetailDTO){
        return new ResponseEntity<>(consignmentDetailService.createConsignmentDetail(consignmentRequestDetailDTO),HttpStatus.CREATED);
    }

    @PostMapping("/update/{consignmentDetailId}")
    public ResponseEntity<ConsignmentDetailDTO> updateConsignmentDetail(@PathVariable int consignmentDetailId, @RequestBody ConsignmentDetailRequestDTO consignmentRequestDetailDTO) {
        return new ResponseEntity<>(consignmentDetailService.updateConsignmentDetail(consignmentDetailId, consignmentRequestDetailDTO), HttpStatus.OK);
    }

    @GetMapping("/export")
    public void exportToExcel(HttpServletResponse response) {
        response.setContentType("application/octet-stream");
        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
        String currentDateTime = dateFormatter.format(new Date());

        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=ConsignmentDetails_" + currentDateTime + ".xlsx";
        response.setHeader(headerKey, headerValue);
        Pageable pageable = Pageable.unpaged();
        List<ConsignmentDetailDTO> listDetail = consignmentDetailService.getAllConsignmentsDetail(pageable).getContent();
        listDetail.sort(Comparator.comparingInt(ConsignmentDetailDTO::getConsignmentId));
        ConsignmentDetailExporter excelExporter = new ConsignmentDetailExporter(listDetail);

        excelExporter.export(response);
    }
}
