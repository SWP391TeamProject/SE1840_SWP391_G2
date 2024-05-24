package fpt.edu.vn.Backend.service;

import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import com.azure.storage.blob.specialized.BlockBlobClient;
import fpt.edu.vn.Backend.DTO.AttachmentDTO;
import fpt.edu.vn.Backend.pojo.Account;
import fpt.edu.vn.Backend.pojo.Attachment;
import fpt.edu.vn.Backend.repository.AccountRepos;
import fpt.edu.vn.Backend.repository.AttachmentRepos;
import org.apache.tika.mime.MimeType;
import org.apache.tika.mime.MimeTypeException;
import org.apache.tika.mime.MimeTypes;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Service
public class AttachmentServiceImpl implements AttachmentService {
    private final AttachmentRepos attachmentRepository;
    private final BlobContainerClient blobContainerClient;
    private final AccountRepos accountRepos;

    @Autowired
    public AttachmentServiceImpl(AttachmentRepos attachmentRepository, AccountRepos accountRepos) {
        this.attachmentRepository = attachmentRepository;
        this.accountRepos = accountRepos;

        String connectStr = System.getenv("AZURE_STORAGE_CONNECTION_STRING");
        if (connectStr != null && !connectStr.isEmpty()) {
            BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
                    .connectionString(connectStr)
                    .buildClient();
            blobContainerClient = blobServiceClient.getBlobContainerClient("attachments");
            blobContainerClient.createIfNotExists();
        } else {
            blobContainerClient = null;
        }
    }

    @Override
    public @NotNull AttachmentDTO mapEntityToDTO(@NotNull Attachment attachment, @NotNull AttachmentDTO attachmentDTO) {
        attachmentDTO.setAttachmentId(attachment.getAttachmentId());
        if (attachment.getLink() != null) {
            attachmentDTO.setUrl(attachment.getLink());
        } else {
            attachmentDTO.setUrl("");
        }
        attachmentDTO.setCreateDate(attachment.getCreateDate());
        attachmentDTO.setUpdateDate(attachment.getUpdateDate());
        return attachmentDTO;
    }

    @Override
    public @NotNull Attachment mapDTOToEntity(@NotNull AttachmentDTO attachmentDTO, @NotNull Attachment attachment) {
        attachment.setAttachmentId(attachmentDTO.getAttachmentId());
        attachment.setUpdateDate(attachmentDTO.getUpdateDate());
        attachment.setLink(attachmentDTO.getUrl());
        attachment.setCreateDate(attachmentDTO.getCreateDate());
        return attachment;
    }

    @Override
    public @NotNull AttachmentDTO uploadAttachment(@NotNull MultipartFile file) throws IOException {
        MimeTypes mimeTypes = MimeTypes.getDefaultMimeTypes();
        MimeType mimeType;
        try {
            mimeType = mimeTypes.forName(file.getContentType());
        } catch (MimeTypeException e) {
            throw new IOException(e);
        }
        String blobId = UUID.randomUUID() + mimeType.getExtension();

        BlockBlobClient blobClient = blobContainerClient.getBlobClient(blobId).getBlockBlobClient();

        // Convert InputStream to ByteArrayInputStream
        byte[] bytes = file.getBytes();
        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(bytes);

        blobClient.upload(byteArrayInputStream, bytes.length, true);

        Attachment attachment = new Attachment();
        attachment.setBlobId(blobId);
        attachment.setLink(blobClient.getBlobUrl());
        attachmentRepository.save(attachment);
        return mapEntityToDTO(attachment);
    }




    @Override
    public @Nullable AttachmentDTO getAttachmentById(int id) {
        return attachmentRepository.findById(id).map(this::mapEntityToDTO).orElse(null);
    }

    @Override
    public boolean deleteAttachment(int attachmentId) {
        Attachment a = attachmentRepository.deleteByAttachmentId(attachmentId);
        if (a != null) {
            BlockBlobClient blobClient = blobContainerClient.getBlobClient(a.getBlobId()).getBlockBlobClient();
            return blobClient.deleteIfExists();
        }
        return false;
    }

    @Override
    public @NotNull AttachmentDTO uploadAccountAttachment(@NotNull MultipartFile file, int accountId) throws IOException {
        // Handle the file upload and get an AttachmentDTO
        AttachmentDTO attachmentDTO = uploadAttachment(file);

        // Find the account
        Account account = accountRepos.findById(accountId).orElseThrow(() -> new IllegalArgumentException("Account not found"));

        // Find the attachment
        Attachment attachment = attachmentRepository.findById(attachmentDTO.getAttachmentId()).orElseThrow(() -> new IllegalArgumentException("Attachment not found"));

        // Set the account to the attachment
        attachment.setAccount(account);

        // Save the attachment
        attachmentRepository.save(attachment);

        // Map the attachment to AttachmentDTO and return it
        return mapEntityToDTO(attachment, attachmentDTO);
    }

    @Override
    public @NotNull AttachmentDTO uploadConsignmentDetailAttachment(@NotNull MultipartFile file, Integer consignmentDetailId) throws IOException {
        return null;
    }

    @Override
    public @NotNull AttachmentDTO uploadItemAttachment(@NotNull MultipartFile file, Integer itemId) throws IOException {
        return null;
    }
}
