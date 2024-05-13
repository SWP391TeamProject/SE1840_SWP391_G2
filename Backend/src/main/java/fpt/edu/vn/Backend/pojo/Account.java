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

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "password", length = 50) // Consider hashing passwords for security
    private String password;

    @Column(name = "phone", length = 15)
    private String phone;

    @CreationTimestamp
    @Column(name = "create_date")
    private LocalDateTime createDate;

    @UpdateTimestamp
    @Column(name = "update_date")
    private LocalDateTime updateDate;

    // ... (relationships)
}

