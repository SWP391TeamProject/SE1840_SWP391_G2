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
@Builder
@Table(name = "consignment")
public class Consignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "consignment_id")
    private int consignmentId;


    @Column(length = 30)
    @Enumerated(EnumType.STRING)
    private Status status; // WAITING_STAFF, IN_INITIAL_VALUATION, etc.

    public enum Status {
        WAITING_STAFF, IN_INITIAL_EVALUATION, SENDING, IN_FINAL_EVALUATION, WAITING_SELLER, TO_ITEM, FINISHED, TERMINATED
    }

    public enum preferContact {
        EMAIL, PHONE, TEXT, ANY
    }

    @Column(name = "prefer_contact")
    @Enumerated(EnumType.STRING)
    private preferContact preferContact;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Account user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assign_staff_id")
    private Account staff;

    @OneToMany(mappedBy = "consignment", fetch = FetchType.LAZY)
    private List<ConsignmentDetail> consignmentDetails;

    @Column(length = 2000, columnDefinition = "NVARCHAR(max)")
    private String description;

    @Column(length = 30)
    private String color;

    @Column(length = 30)
    private String size;

    @Column(length = 30)
    private String weight;

    @Column(length = 30)
    private String brand;

    @Column(length = 30)
    private Integer age;

    @Column(length = 30)
    private String material;

    @CreationTimestamp
    @Column(name = "create_date")
    private LocalDateTime createDate;

    @UpdateTimestamp
    @Column(name = "update_date")
    private LocalDateTime updateDate;

    @OneToMany
    @JoinColumn(name = "consignment_id")
    private List<Attachment> attachments;
}

