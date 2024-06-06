package fpt.edu.vn.Backend.pojo;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.boot.context.properties.bind.DefaultValue;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "auction_session")
public class AuctionSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int auctionSessionId;

    private String title;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    @Column(length = 30)
    @Enumerated(EnumType.STRING)
    private Status status; // SCHEDULED, PROGRESSING, FINISHED, TERMINATED

    public enum Status {
        SCHEDULED, PROGRESSING, FINISHED, TERMINATED
    }


//
//    @Column(name = "is_featured")
//    private byte isFeatured =0;


    @CreationTimestamp
    @Column(name = "create_date")
    private LocalDateTime createDate;

    @UpdateTimestamp
    @Column(name = "update_date")
    private LocalDateTime updateDate;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "auction_session_id")
    private List<AuctionItem> auctionItems;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "auction_session_id")
    private List<Attachment> attachments;
}

