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

    @Column(length = 20, nullable = false,name = "object_type")
    private String objectType; // consignment, blog, item

    @Column(nullable = false,name = "object_id")
    private int objectId;

    @Column(length = 300,name = "link")
    private String link;

    @Column(length = 10)
    private String type; // jpg, png, mp4, etc.

    @CreationTimestamp
    @Column(name = "create_date")
    private LocalDateTime createDate;

    @UpdateTimestamp
    @Column(name = "update_date")
    private LocalDateTime updateDate;


}
