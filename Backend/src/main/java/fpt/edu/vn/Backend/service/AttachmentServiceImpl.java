package fpt.edu.vn.Backend.service;

import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import com.azure.storage.blob.specialized.BlockBlobClient;
import fpt.edu.vn.Backend.pojo.Attachment;
import fpt.edu.vn.Backend.repository.AttachmentRepos;
import org.apache.tika.mime.MimeType;
import org.apache.tika.mime.MimeTypeException;
import org.apache.tika.mime.MimeTypes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
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
    public Attachment uploadAttachment(MultipartFile file, int entityId, Attachment.EntityType entityType) throws IOException {
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
        String directLink = blobClient.getBlobUrl();
        Attachment.FileType fileType = Attachment.FileType.UNKNOWN;
        if (file.getContentType() != null) {
            if (file.getContentType().startsWith("image")) {
                fileType = Attachment.FileType.IMAGE;
            } else if (file.getContentType().startsWith("video")) {
                fileType = Attachment.FileType.VIDEO;
            }
        }
        Attachment attachment = new Attachment(
                null,
                blobId,
                directLink, fileType,
                entityId, entityType,
                null, null);
        attachmentRepository.save(attachment);
        return attachment;
    }

    @Override
    public Attachment getAttachmentById(int id) {
        return attachmentRepository.findByAttachmentId(id);
    }

    @Override
    public List<Attachment> getAllAttachments() {
        return attachmentRepository.findAll();
    }

    @Override
    public List<Attachment> getAllAttachmentsByEntity(int entityId, Attachment.EntityType entityType) {
        return attachmentRepository.findByEntityIdAndEntityType(entityId, entityType);
    }

    @Override
    public boolean deleteAttachmentByAttachmentId(int attachmentId) {
        Attachment attachment = attachmentRepository.deleteByAttachmentId(attachmentId);
        if (attachment != null) {
            BlockBlobClient blobClient = blobContainerClient.getBlobClient(attachment.getBlobId()).getBlockBlobClient();
            return blobClient.deleteIfExists();
        }
        return false;
    }

    @Override
    public boolean deleteAttachmentsByEntity(int entityId, Attachment.EntityType entityType) {
        Attachment attachment = attachmentRepository.deleteByEntityIdAndEntityType(entityId, entityType);
        if (attachment != null) {
            BlockBlobClient blobClient = blobContainerClient.getBlobClient(attachment.getBlobId()).getBlockBlobClient();
            return blobClient.deleteIfExists();
        }
        return false;
    }
}
