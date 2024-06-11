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
public class Token {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    String token;
    @Column(name = "exipration_time")
    Date expiryTime;
    @Column(name = "token_type")
    String tokenType;
}
