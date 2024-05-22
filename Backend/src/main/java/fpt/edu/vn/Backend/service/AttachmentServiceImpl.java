package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.pojo.Attachment;
import fpt.edu.vn.Backend.repository.AttachmentRepos;
import org.apache.tika.mime.MimeType;
import org.apache.tika.mime.MimeTypeException;
import org.apache.tika.mime.MimeTypes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.core.io.WritableResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;
import java.util.UUID;

@Service
public class AttachmentServiceImpl implements AttachmentService {
    private final AttachmentRepos attachmentRepository;
    private final ResourceLoader resourceLoader;

    @Autowired
    public AttachmentServiceImpl(AttachmentRepos attachmentRepository, @Qualifier("azureStorageFileProtocolResolver") ResourceLoader resourceLoader) {
        this.attachmentRepository = attachmentRepository;
        this.resourceLoader = resourceLoader;
    }

    public String getResourcePath(String containerName, String blobId) {
        return String.format("azure-blob://%s/%s", containerName, blobId);
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
        String resourcePath = getResourcePath(entityType.toString(), blobId);
        Resource blobResource = resourceLoader.getResource(resourcePath);
        try (OutputStream os = ((WritableResource) blobResource).getOutputStream()) {
            os.write(file.getBytes());
        }
        String directLink = blobResource.getURI().toString();
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
    public void deleteAttachment(int id) {
        attachmentRepository.deleteByAttachmentId(id);
    }

    @Override
    public void deleteAttachmentsByEntity(int entityId, Attachment.EntityType entityType) {
        attachmentRepository.deleteByEntityIdAndEntityType(entityId, entityType);
    }
}
