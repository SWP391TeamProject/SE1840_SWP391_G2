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
public class SupportTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ticketId;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private SupportTicketCategory category;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Account user;

    @Column(length = 200)
    private String title;

    @Column(length = 2000)
    private String content;

    @CreationTimestamp
    private LocalDateTime createDate;

    @UpdateTimestamp
    private LocalDateTime updateDate;

    @OneToOne(mappedBy = "supportTicket")
    private Consignment consignment;

    @OneToMany(mappedBy = "ticket")
    private List<SupportTicketReply> replies;
}
