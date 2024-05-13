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
    private int attachmentId;

    @Column(length = 20)
    private String objectType; // ticket, ticket_reply, item

    private int objectId;

    @Column(length = 300)
    private String link;

    @Column(length = 10)
    private String type; // jpg, png, mp4, etc.

    @CreationTimestamp
    private LocalDateTime createDate;

    @UpdateTimestamp
    private LocalDateTime updateDate;


}
