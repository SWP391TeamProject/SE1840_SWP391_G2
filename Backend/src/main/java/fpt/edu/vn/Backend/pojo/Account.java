package fpt.edu.vn.Backend.pojo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
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
@Table(name = "account")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "account_id")
    private int accountId;

    @Column(name = "nickname", length = 100)
    private String nickname;

    @OneToOne
    private Attachment avatarUrl;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "role_account",
            joinColumns = @JoinColumn(name = "account_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> authorities;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "password", length = 50)
    private String password;

    @Column(name = "phone", length = 15)
    private String phone;

    @Column(name = "status")
    @ColumnDefault("1")
    private byte status;
  
    @Enumerated(EnumType.STRING)
    public AuthProvider provider;
    public enum AuthProvider{
        local,facebook,google
    }
    @Column(name = "balance")
    private BigDecimal balance;

    @CreationTimestamp
    @Column(name = "create_date")
    private LocalDateTime createDate;

    @UpdateTimestamp
    @Column(name = "update_date")
    private LocalDateTime updateDate;

    @OneToMany(fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JoinColumn(name = "account_id")
    private List<Notification> notifications;

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "author",cascade = CascadeType.ALL)
    private List<BlogPost> blogPosts;

    @OneToMany(mappedBy = "account")
    private List<Bid> bids;

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "owner",cascade = CascadeType.ALL)
    private List<Item> items;

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "account",cascade = CascadeType.ALL)
    private Set<Payment> payments;

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "account",cascade = CascadeType.ALL)
    private Set<Deposit> deposits;

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "account",cascade = CascadeType.ALL)
    private Set<ConsignmentDetail> consignmentDetails;
}

