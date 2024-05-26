package fpt.edu.vn.Backend.DTO;

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
    private String url;
    @NotNull
    private LocalDateTime createDate;
    @NotNull
    private LocalDateTime updateDate;
}
