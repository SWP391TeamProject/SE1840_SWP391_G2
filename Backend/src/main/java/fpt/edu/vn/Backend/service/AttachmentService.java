package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.pojo.Attachment;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface AttachmentService {
    @NotNull default Attachment uploadAttachment(@NotNull MultipartFile file) throws IOException {
        return uploadAttachment(file, null);
    }

    @NotNull Attachment uploadAttachment(@NotNull MultipartFile file, Integer attachmentId) throws IOException;

    @Nullable Attachment getAttachmentById(int id);

    boolean deleteAttachment(int attachmentId);
}