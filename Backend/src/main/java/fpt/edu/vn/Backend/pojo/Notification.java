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
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int notificationId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Account user;

    @Column(length = 500)
    private String message;

    @Column(length = 20)
    private String type; // news, system, support, etc.

    private boolean read; // Use boolean for read/unread status

    @CreationTimestamp
    private LocalDateTime createDate;

    @UpdateTimestamp
    private LocalDateTime updateDate;
}
