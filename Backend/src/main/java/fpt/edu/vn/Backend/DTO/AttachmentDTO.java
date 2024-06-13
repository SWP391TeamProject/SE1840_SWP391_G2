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
    @NotNull
    private String link;
    @NotNull
    private LocalDateTime createDate;
    @NotNull
    private LocalDateTime updateDate;

    public AttachmentDTO(Attachment attachment) {
        this.attachmentId = attachment.getAttachmentId();
        this.link = (attachment.getLink() != null) ? attachment.getLink() : "default_link"; // Provide a default link
        this.createDate = (attachment.getCreateDate() != null) ? attachment.getCreateDate() : LocalDateTime.now(); // Default to current time
        this.updateDate = (attachment.getUpdateDate() != null) ? attachment.getUpdateDate() : LocalDateTime.now(); // Default to current time
    }
}
