package fpt.edu.vn.Backend.repository;

import fpt.edu.vn.Backend.pojo.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttachmentRepos extends JpaRepository<Attachment, Integer> {
    Attachment deleteByAttachmentId(int attachmentId);
}
