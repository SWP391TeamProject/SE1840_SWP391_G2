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
public class AuctionSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int auctionSessionId;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    @Column(length = 30)
    private String status; // SCHEDULED, PROGRESSING, FINISHED, TERMINATED

    @CreationTimestamp
    private LocalDateTime createDate;

    @UpdateTimestamp
    private LocalDateTime updateDate;

    //Relationships
    @OneToMany
    @JoinColumn(name = "auction_session_id")
    private List<AuctionItem> auctionItems;


}

