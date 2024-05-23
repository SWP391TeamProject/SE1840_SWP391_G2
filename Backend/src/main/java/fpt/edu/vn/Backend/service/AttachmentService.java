//package fpt.edu.vn.Backend.service;
//
//import fpt.edu.vn.Backend.pojo.Attachment;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.util.List;
//
//public interface AttachmentService {
//    Attachment uploadAttachment(MultipartFile file, int entityId, Attachment.FileType fileType) throws IOException;
//
//    Attachment getAttachmentById(int id);
//
//    List<Attachment> getAllAttachments();
//
//    List<Attachment> getAllAttachmentsByEntity(int entityId, Attachment.FileType fileType);
//
//    boolean deleteAttachmentByAttachmentId(int attachmentId);
//
//    boolean deleteAttachmentsByEntity(int entityId, Attachment.FileType fileType);
//}