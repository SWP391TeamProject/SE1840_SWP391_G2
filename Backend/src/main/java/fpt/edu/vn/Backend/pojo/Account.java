package fpt.edu.vn.Backend.pojo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "accounts") // Optional table name customization
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private int userId;

    @Column(name = "nickname", length = 100)
    private String nickname;

    @Column(name = "role", length = 20)
    private String role;

    @Column(name = "email", length = 100, unique = true)
    private String email;

    @Column(name = "password", length = 50) // Consider hashing passwords for security
    private String password;

    @Column(name = "phone", length = 15, unique = true)
    private String phone;

    @Column(name = "balance")
    private BigDecimal balance;

    @CreationTimestamp
    @Column(name = "create_date")
    private LocalDateTime createDate;

    @UpdateTimestamp
    @Column(name = "update_date")
    private LocalDateTime updateDate;

    @OneToMany(fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private List<Notification> notifications;

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "author",cascade = CascadeType.ALL)
    private List<BlogPost> blogPosts;

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "bidder",cascade = CascadeType.ALL)
    private List<AuctionBid> auctionBids;

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY,mappedBy = "owner",cascade = CascadeType.ALL)
    private List<Item> items;

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "staff",cascade = CascadeType.ALL)
    private List<Consignment> staffConsignments;

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "requester",cascade = CascadeType.ALL)
    private List<Consignment> requesterConsignments;

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "buyer",cascade = CascadeType.ALL)
    private List<Transactions> transactions;






    // ... (relationships)
}

