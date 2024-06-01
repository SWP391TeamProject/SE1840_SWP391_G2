package fpt.edu.vn.Backend.pojo;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.NaturalId;
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
    private Integer attachmentId;

    @NaturalId
    private String blobId;

    @Column(length = 300, name = "link")
    private String link;


    @ManyToOne
    @JoinColumn(name = "item_id")
    private Item item;
    @Column(length = 10)
    @Enumerated
    private FileType type; // jpg, png, mp4, etc.

    enum FileType {
        JPG, PNG, MP4
    }

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

    @ManyToOne
    @JoinColumn(name = "consignment_id")
    private Consignment consignment;
    @Column(name = "attachment_type")
    @Enumerated
    private type attachmentType;

    enum type {}

    @ManyToOne
    @JoinColumn(name = "auction_session_id")
    private AuctionSession auctionSession;

    @ManyToOne()
    @JoinColumn(name = "consignment_detail_id")
    private ConsignmentDetail consignmentDetail;

    @ManyToOne()
    @JoinColumn(name = "blog_id")
    private BlogPost blogPost;

    @CreationTimestamp
    @Column(name = "create_date")
    private LocalDateTime createDate;

    @UpdateTimestamp
    @Column(name = "update_date")
    private LocalDateTime updateDate;

}

