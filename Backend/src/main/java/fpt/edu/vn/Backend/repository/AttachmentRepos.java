//package fpt.edu.vn.Backend.repository;
//
//import fpt.edu.vn.Backend.pojo.Attachment;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//
//@Repository
//public interface AttachmentRepos extends JpaRepository<Attachment, Integer> {
//    Attachment findByAttachmentId(int id);
//    List<Attachment> findByFileIdAndFileType(int fileId, Attachment.FileType fileType);
//    Attachment deleteByAttachmentId(int id);
//    Attachment deleteByFileIdAndFileType(int fileId, Attachment.FileType fileType);
//}
