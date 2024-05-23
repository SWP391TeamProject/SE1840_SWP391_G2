package fpt.edu.vn.Backend.pojo;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
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
@Builder
@Table(name = "consignment")
public class Consignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "consignment_id")
    private int consignmentId;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    @Enumerated(EnumType.STRING)
    private Status status; // WAITING_STAFF, IN_INITIAL_VALUATION, etc.

    public enum Status {
        WAITING_STAFF, IN_INITIAL_EVALUATION,SENDING, IN_FINAL_EVALUATION, FINISHED, TERMINATED
    }

    public enum preferContact {
        EMAIL, PHONE
    }
    @Column(name = "prefer_contact")
    @Enumerated(EnumType.STRING)
    private preferContact preferContact;

//    @Collumn(name ="assignedStaff")

    @OneToMany(mappedBy = "consignment", fetch = FetchType.LAZY)
    private List<ConsignmentDetail> consignmentDetails;

    @CreationTimestamp
    @Column(name = "create_date")
    private LocalDateTime createDate;

    @UpdateTimestamp
    @Column(name = "update_date")
    private LocalDateTime updateDate;


}

