package fpt.edu.vn.Backend.DTO;

import fpt.edu.vn.Backend.pojo.Attachment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttachmentDTO {
    private int attachmentId;
    private String link;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;

    public AttachmentDTO(Attachment attachment) {
        this.attachmentId = attachment.getAttachmentId();
        this.link = (attachment.getLink() != null) ? attachment.getLink() : null;
        this.createDate = (attachment.getCreateDate() != null) ? attachment.getCreateDate() : null;
        this.updateDate = (attachment.getUpdateDate() != null) ? attachment.getUpdateDate() : null;
    }
}
