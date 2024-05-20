package fpt.edu.vn.Backend.service;

import fpt.edu.vn.Backend.pojo.Attachment;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AttachmentService {
    Attachment uploadAttachment(MultipartFile file);

    List<Attachment> uploadBulkAttachments(MultipartFile[] files);

    Attachment getAttachmentById(int id);

    List<Attachment> getAllAttachments();

    List<Attachment> getAllAttachmentsByObjectIdAndObjectType(int objectId , String objectType);


    Attachment updateAttachment(Attachment attachment);

    void deleteAttachment(int id);
}