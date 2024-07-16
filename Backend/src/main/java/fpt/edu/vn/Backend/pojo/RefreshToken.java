package fpt.edu.vn.Backend.pojo;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    String refreshToken;
    @Column(name = "exipration_token_time")
    Date expiryTime;
    @Column(name = "token_type")
    String tokenType;

    @OneToOne
    @JoinColumn(name = "account_id")
    Account account;
}
