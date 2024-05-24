package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.DTO.AttachmentDTO;
import fpt.edu.vn.Backend.DTO.ItemDTO;
import fpt.edu.vn.Backend.pojo.Attachment;
import fpt.edu.vn.Backend.pojo.Item;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface AttachmentService {
    @NotNull AttachmentDTO mapEntityToDTO(@NotNull Attachment attachment, @NotNull AttachmentDTO attachmentDTO);
    @NotNull default AttachmentDTO mapEntityToDTO(@NotNull Attachment attachment) {
        return mapEntityToDTO(attachment, new AttachmentDTO());
    }
    @NotNull Attachment mapDTOToEntity(@NotNull AttachmentDTO attachmentDTO, @NotNull Attachment attachment);
    @NotNull default Attachment mapDTOToEntity(@NotNull AttachmentDTO attachmentDTO) {
        return mapDTOToEntity(attachmentDTO, new Attachment());
    }

    @NotNull default AttachmentDTO uploadAttachment(@NotNull MultipartFile file) throws IOException {
        return uploadAttachment(file, null);
    }

    @NotNull AttachmentDTO uploadAttachment(@NotNull MultipartFile file, Integer attachmentId) throws IOException;

    @Nullable AttachmentDTO getAttachmentById(int id);

    boolean deleteAttachment(int attachmentId);
}