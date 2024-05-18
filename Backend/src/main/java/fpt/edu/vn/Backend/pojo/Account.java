package fpt.edu.vn.Backend.pojo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Account  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "account_id")
    private int accountId;

    @Column(name = "nickname", length = 100)
    private String nickname;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "account_role",
            joinColumns = @JoinColumn(name = "account_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> authorities;

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

    @OneToMany(mappedBy = "account")
    private List<AuctionBid> auctionBids;

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY,mappedBy = "owner",cascade = CascadeType.ALL)
    private List<Item> items;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "account_consignments",
            joinColumns = @JoinColumn(name = "account_id"),
            inverseJoinColumns = @JoinColumn(name = "consignment_id")
    )
    private List<Consignment> consignments;

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "account",cascade = CascadeType.ALL)
    private List<Transactions> transactions;






    // ... (relationships)
}

