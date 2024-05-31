package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttachmentRepos extends JpaRepository<Attachment, Integer> {
    Attachment deleteByAttachmentId(int attachmentId);
//    Attachment findByAttachmentId(int id);
//    List<Attachment> findByEntityIdAndEntityType(int entityId, Attachment.EntityType entityType);
//    Attachment deleteByAttachmentId(int id);
//    Attachment deleteByEntityIdAndEntityType(int entityId, Attachment.EntityType entityType);
}
