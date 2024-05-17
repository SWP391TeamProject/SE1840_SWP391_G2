package fpt.edu.vn.Backend.pojo;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AccountMember {
    @Id
    private int userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private Account account;

    private BigDecimal balance;
}
