package fpt.edu.vn.Backend.pojo;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
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
@Table(name = "[account]") // Optional table name customization
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "userId")

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

    @Column(name = "status", columnDefinition = "boolean default true")
    private boolean status;

    @Column(name = "balance")
    private BigDecimal balance;

    @CreationTimestamp
    @Column(name = "create_date")
    private LocalDateTime createDate;

    @UpdateTimestamp
    @Column(name = "update_date")
    private LocalDateTime updateDate;

    @OneToMany
    @JoinColumn(name = "user_id")
    private List<Notification> notifications;

    @OneToMany

    @JoinColumn(name = "user_id")
    private List<BlogPost> blogPosts;

    @OneToMany
    @JoinColumn(name = "bidder_id")
    private List<AuctionBid> auctionBids;

    @OneToMany
    @JoinColumn(name = "seller_id")
    private List<Item> items;

    @OneToMany
    @JoinColumn(name = "staff_id")
    private List<Consignment> staffConsignments;

    @OneToMany
    @JoinColumn(name = "requester_id")
    private List<Consignment> requesterConsignments;

    @OneToMany
    @JoinColumn(name = "user_id")
    private List<Transaction> transactions;

    public Account(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // ... (relationships)
}

