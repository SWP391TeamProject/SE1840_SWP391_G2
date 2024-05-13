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
public class Consignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int consignmentId;

    @ManyToOne
    @JoinColumn(name = "requester_id")
    private Account requester;

    @ManyToOne
    @JoinColumn(name = "staff_id")
    private Account staff;

    @OneToOne
    @JoinColumn(name = "support_ticket")
    private SupportTicket supportTicket;

    @Column(length = 30)
    private String status; // WAITING_STAFF, IN_INITIAL_VALUATION, etc.

    @CreationTimestamp
    private LocalDateTime createDate;

    @UpdateTimestamp
    private LocalDateTime updateDate;
}

