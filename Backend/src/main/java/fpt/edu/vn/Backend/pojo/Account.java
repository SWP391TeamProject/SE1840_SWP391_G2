package fpt.edu.vn.Backend.pojo;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.NaturalId;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.format.annotation.NumberFormat;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "accounts")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "account_id")
    private int accountId;

    @OneToOne(mappedBy = "account", cascade = CascadeType.ALL)
    @PrimaryKeyJoinColumn
    private CitizenCard citizenCard;

    @Column(columnDefinition="bit default 0", nullable = false)
    private boolean require2fa = false;

    @Column(name = "nickname", length = 100)
    private String nickname;

    @OneToOne(cascade = CascadeType.ALL)
    private Attachment avatarUrl;

    @Column(name = "provider",length = 30)
    @Enumerated(EnumType.STRING)
    public AuthProvider provider;

    public enum AuthProvider{
        LOCAL,FACEBOOK,GOOGLE
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "role",length = 30)
    private Role role;
    public enum Role {
        ADMIN,
        MEMBER,
        MANAGER,
        STAFF;
    }

    @NotBlank(message = "Email is mandatory")
    @Email(message = "Email should be valid")
    @NaturalId
    private String email;

    @NotBlank(message = "Password is mandatory")
    @Size(max = 255, message = "Password must be less than 255 characters")
    @Column(name = "password", length = 255 ,columnDefinition = "NVARCHAR(255)")
    private String password;

    @Size(max = 15, message = "Phone must be less than 15 characters")
    @Column(name = "phone", length = 15)
    private String phone;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private Status status = Status.DISABLED;

    @Column(name = "balance")
    private BigDecimal balance = new BigDecimal(0);

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

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "owner",cascade = CascadeType.ALL)
    private List<Item> items;

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "account",cascade = CascadeType.ALL)
    private Set<Payment> payments;

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "account",cascade = CascadeType.ALL)
    private Set<ConsignmentDetail> consignmentDetails;

    public enum Status {
        ACTIVE,
        DISABLED
    }


}

