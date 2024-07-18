package fpt.edu.vn.Backend.pojo;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
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

    @Email
    @Column(length = 50)
    private String contactEmail;

    @Column(length = 30,columnDefinition = "NVARCHAR(30)")
    private String contactName;

    @Column(length = 20)
    private String contactPhone;



    @Column(length = 25)
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

    private double weight;

    @Column(length = 30)
    private String metal;

    @Column(length = 30,columnDefinition = "NVARCHAR(30)")
    private String gemstone;

    @Column(length = 30,columnDefinition = "NVARCHAR(30)")
    private String measurement;

    @Column(length = 30,columnDefinition = "NVARCHAR(30)")
    private String condition;

    @Column(length = 30,columnDefinition = "NVARCHAR(30)")
    private String stamped;

    @Column(length = 10,columnDefinition = "VARCHAR(30)")
    private String secretCode;



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

