package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.AttachmentDTO;
import fpt.edu.vn.Backend.service.AttachmentService;
import fpt.edu.vn.Backend.service.ConsignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/attachments")
public class AttachmentController {
    ConsignmentService consignmentService;
    AttachmentService attachmentService;
    @Autowired
    public AttachmentController(ConsignmentService consignmentService, AttachmentService attachmentService) {
        this.consignmentService = consignmentService;
        this.attachmentService = attachmentService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadAttachment(@RequestParam("file") MultipartFile file,@RequestParam int id) {
        try {
            AttachmentDTO attachmentDTO = attachmentService.uploadAttachment(file,id);
            return ResponseEntity.ok(attachmentDTO);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload file: " + e.getMessage());
        }
    }
}
