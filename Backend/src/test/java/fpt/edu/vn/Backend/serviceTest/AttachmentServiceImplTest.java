package fpt.edu.vn.Backend.serviceTest;

import com.azure.storage.blob.BlobContainerClient;
import fpt.edu.vn.Backend.DTO.AttachmentDTO;
import fpt.edu.vn.Backend.pojo.Attachment;
import fpt.edu.vn.Backend.repository.AttachmentRepos;
import fpt.edu.vn.Backend.service.AttachmentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class AttachmentServiceImplTest {

    @InjectMocks
    private AttachmentServiceImpl attachmentService;

    @Mock
    private AttachmentRepos attachmentRepository;

    @Mock
    private BlobContainerClient blobContainerClient;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Should upload account attachment successfully")
    public void shouldUploadAccountAttachmentSuccessfully() throws IOException {
        MultipartFile file = new MockMultipartFile("file", "hello.txt", "text/plain", "Hello, World!".getBytes());
        int accountId = 1;

        when(attachmentRepository.save(any(Attachment.class))).thenAnswer(i -> i.getArguments()[0]);

        AttachmentDTO result = attachmentService.uploadAccountAttachment(file, accountId);

        assertNotNull(result);
        assertEquals("hello.txt", result.getUrl());
    }

    @Test
    @DisplayName("Should throw IOException when file content type is unknown")
    public void shouldThrowIOExceptionWhenFileContentTypeIsUnknown() {
        MultipartFile file = new MockMultipartFile("file", "hello.txt", "unknown/unknown", "Hello, World!".getBytes());
        Integer accountId = 1;

        assertThrows(IOException.class, () -> attachmentService.uploadAccountAttachment(file, accountId));
    }

    @Test
    @DisplayName("Should update existing attachment when attachmentId is provided")
    public void shouldUpdateExistingAttachmentWhenAttachmentIdIsProvided() throws IOException {
        MultipartFile file = new MockMultipartFile("file", "hello.txt", "text/plain", "Hello, World!".getBytes());
        Integer accountId = 1;
        Attachment existingAttachment = new Attachment();
        existingAttachment.setAttachmentId(accountId);
        existingAttachment.setLink("old_link");

        when(attachmentRepository.findById(accountId)).thenReturn(Optional.of(existingAttachment));
        when(attachmentRepository.save(any(Attachment.class))).thenAnswer(i -> i.getArguments()[0]);

        AttachmentDTO result = attachmentService.uploadAccountAttachment(file, accountId);

        assertNotNull(result);
        assertEquals("hello.txt", result.getUrl());
        assertNotEquals("old_link", result.getUrl());
    }
}