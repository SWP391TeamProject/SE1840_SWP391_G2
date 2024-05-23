package fpt.edu.vn.Backend.pojo;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.NaturalId;
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

    @NaturalId
    private String blobId;

    @Column(length = 300,name = "link")
    private String link;

    @Column(length = 10)
    @Enumerated(EnumType.STRING)
    private FileType type; // jpg, png, mp4, etc.

    public enum FileType {
        IMAGE,VIDEO,UNKNOWN
    }

    @Column(name = "attachment_type")
    @Enumerated(EnumType.STRING)
    private Type attachmentType;
    enum Type{

        BANNER,AVATAR,PROFILE
    }

    @CreationTimestamp
    @Column(name = "create_date")
    private LocalDateTime createDate;

    @UpdateTimestamp
    @Column(name = "update_date")
    private LocalDateTime updateDate;


}
