package fpt.edu.vn.Backend.service;

import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import com.azure.storage.blob.specialized.BlockBlobClient;
import fpt.edu.vn.Backend.DTO.AttachmentDTO;
import fpt.edu.vn.Backend.pojo.Attachment;
import fpt.edu.vn.Backend.repository.AttachmentRepos;
import org.apache.tika.mime.MimeType;
import org.apache.tika.mime.MimeTypeException;
import org.apache.tika.mime.MimeTypes;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class AttachmentServiceImpl implements AttachmentService {
    private final AttachmentRepos attachmentRepository;
    private final BlobContainerClient blobContainerClient;

    @Autowired
    public AttachmentServiceImpl(AttachmentRepos attachmentRepository) {
        this.attachmentRepository = attachmentRepository;

        String connectStr = System.getenv("AZURE_STORAGE_CONNECTION_STRING");
        BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
                .connectionString(connectStr)
                .buildClient();
        blobContainerClient = blobServiceClient.getBlobContainerClient("attachments");
        blobContainerClient.createIfNotExists();
    }

    @Override
    public @NotNull AttachmentDTO mapEntityToDTO(@NotNull Attachment attachment, @NotNull AttachmentDTO attachmentDTO) {
        attachmentDTO.setAttachmentId(attachment.getAttachmentId());
        attachmentDTO.setUrl(attachment.getLink());
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
    public @NotNull AttachmentDTO uploadAttachment(@NotNull MultipartFile file, @Nullable Integer attachmentId) throws IOException {
        MimeTypes mimeTypes = MimeTypes.getDefaultMimeTypes();
        MimeType mimeType;
        try {
            mimeType = mimeTypes.forName(file.getContentType());
        } catch (MimeTypeException e) {
            throw new IOException(e);
        }
        String blobId = UUID.randomUUID() + mimeType.getExtension();

        BlockBlobClient blobClient = blobContainerClient.getBlobClient(blobId).getBlockBlobClient();
        blobClient.upload(file.getInputStream(), file.getSize(), true);

        Attachment attachment = null;
        if (attachmentId != null)
            attachment = attachmentRepository.findById(attachmentId).orElse(null);
        if (attachment == null)
            attachment = new Attachment();

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
}
