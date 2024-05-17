package fpt.edu.vn.Backend.pojo;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SupportTicketReply {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int replyId;

    @ManyToOne
    @JoinColumn(name = "ticket_id")
    private SupportTicket ticket;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Account user;

    @Column(length = 2000)
    private String content;

    @CreationTimestamp
    private LocalDateTime createDate;

    @UpdateTimestamp
    private LocalDateTime updateDate;

}

