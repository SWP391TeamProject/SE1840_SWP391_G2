package fpt.edu.vn.Backend.pojo;

import jakarta.persistence.*;
import lombok.*;
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
public class Consignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "consignment_id")
    private int consignmentId;

    @Column(length = 30)
    private String status; // WAITING_STAFF, IN_INITIAL_VALUATION, etc.

    public enum preferContact {
        EMAIL, PHONE
    }
    @Column(name = "prefer_contact")
    @Enumerated(EnumType.STRING)
    private preferContact preferContact;

    @CreationTimestamp
    @Column(name = "create_date")
    private LocalDateTime createDate;

    @UpdateTimestamp
    @Column(name = "update_date")
    private LocalDateTime updateDate;


}

