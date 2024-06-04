package fpt.edu.vn.Backend.pojo;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
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
@Table(name = "citizen_card")
public class CitizenCard {
    @Id
    @Column(name = "account_id")
    private int userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "account_id")
    private Account account;

    @Column(unique = true , length = 12,name = "card_id")
    private String cardId;

    @Column(length = 100,name = "full_name")
    private String fullName;

    private LocalDate birthday;

    @Column(length = 20)
    private boolean gender;

    @Column(length = 200)
    private String address;

    @Column(length = 30)
    private String city;

    @CreationTimestamp
    @Column(name = "create_date")
    private LocalDateTime createDate;

    @UpdateTimestamp
    @Column(name = "update_date")
    private LocalDateTime updateDate;
}
