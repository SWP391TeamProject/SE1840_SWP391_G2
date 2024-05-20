package fpt.edu.vn.Backend.pojo;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
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
@Table(name = "auction_session")
public class AuctionSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int auctionSessionId;

    private String title;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    @Column(length = 30)
    private Status status; // SCHEDULED, PROGRESSING, FINISHED, TERMINATED

    enum Status {
        SCHEDULED, PROGRESSING, FINISHED, TERMINATED
    }

    @CreationTimestamp
    @Column(name = "create_date")
    private LocalDateTime createDate;

    @UpdateTimestamp
    @Column(name = "update_date")
    private LocalDateTime updateDate;
    //Relationships
    @OneToMany
    @JoinColumn(name = "auction_session_id")
    private List<AuctionItem> auctionItems;

    @OneToMany(mappedBy = "auctionSession")
    private List<Deposit> deposits;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "auction_session_id")
    private List<Attachment> attachments;



}

