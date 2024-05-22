package fpt.edu.vn.Backend.pojo;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Attachment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer attachmentId;

    @Column(length = 300,name = "link")
    private String link;

    @Column(length = 10)
    private FileType fileType; // jpg, png, mp4, etc.

    public enum FileType {
        IMAGE,VIDEO,UNKNOWN
    }

    private int entityId;

    @Enumerated
    @Column(name = "attachment_category")
    private EntityType entityType;

    public enum EntityType {
        BANNER,AVATAR,PROFILE
    }

    @CreationTimestamp
    @Column(name = "create_date")
    private LocalDateTime createDate;

    @UpdateTimestamp
    @Column(name = "update_date")
    private LocalDateTime updateDate;


}
