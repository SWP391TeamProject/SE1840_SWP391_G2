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
        this.link = attachment.getLink();
        this.createDate = attachment.getCreateDate();
        this.updateDate = attachment.getUpdateDate();
    }
}
