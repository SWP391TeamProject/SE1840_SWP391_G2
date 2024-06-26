package fpt.edu.vn.Backend.pojo;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
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


    @Column(name = "title", length = 100, columnDefinition = "NVARCHAR(100)")
    private String title;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    @Column(length = 30)
    @Enumerated(EnumType.STRING)
    private Status status; // SCHEDULED, PROGRESSING, FINISHED, TERMINATED

    public enum Status {
        SCHEDULED, PROGRESSING, FINISHED, TERMINATED
    }

//    @Column(name = "is_featured")
//    private byte isFeatured;

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

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "auction_session_id")
    private Set<Deposit> deposits;
}

