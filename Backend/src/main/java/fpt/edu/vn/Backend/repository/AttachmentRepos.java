package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttachmentRepos extends JpaRepository<Attachment, Integer> {
    Attachment findByAttachmentId(int id);
    List<Attachment> findByEntityIdAndEntityType(int entityId, Attachment.EntityType entityType);
    void deleteByAttachmentId(int id);
    void deleteByEntityIdAndEntityType(int entityId, Attachment.EntityType entityType);
}
