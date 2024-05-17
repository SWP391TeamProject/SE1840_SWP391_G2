package fpt.edu.vn.Backend.pojo;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CitizenCard {
    @Id
    private int userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private Account user;

    @Column(unique = true , length = 12)
    private String cardId;

    @Column(length = 100)
    private String fullname;

    private LocalDate birthday;

    @Column(length = 20)
    private boolean gender;

    @Column(length = 200)
    private String address;

    @Column(length = 30)
    private String city;

    @CreationTimestamp
    private LocalDateTime createDate;

    @UpdateTimestamp
    private LocalDateTime updateDate;
}
