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



    @NotNull AttachmentDTO uploadAttachment(@NotNull MultipartFile file) throws IOException;

    @Nullable AttachmentDTO getAttachmentById(int id);

    boolean deleteAttachment(int attachmentId);

    @NotNull AttachmentDTO uploadAccountAttachment(@NotNull MultipartFile file, int accountId) throws IOException;
    @NotNull AttachmentDTO uploadConsignmentDetailAttachment(@NotNull MultipartFile file, int consignmentDetailId);
    @NotNull AttachmentDTO uploadItemAttachment(@NotNull MultipartFile file, Integer itemId) throws IOException;
    @NotNull AttachmentDTO uploadBlogAttachment(@NotNull MultipartFile file, Integer BlogId) throws IOException;

    @NotNull AttachmentDTO uploadItemAttachment(@NotNull MultipartFile[] file, int itemId) throws IOException;
//    Attachment uploadAttachment(MultipartFile file, int entityId, Attachment.EntityType entityType) throws IOException;
//
//    Attachment getAttachmentById(int id);
//
//    List<Attachment> getAllAttachments();
//
//    List<Attachment> getAllAttachmentsByEntity(int entityId, Attachment.EntityType entityType);
//
//    boolean deleteAttachmentByAttachmentId(int attachmentId);
//
//    boolean deleteAttachmentsByEntity(int entityId, Attachment.EntityType entityType);
}