package fpt.edu.vn.Backend.pojo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "jewelry")
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "jewelry_id")
    private Integer itemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "jewelry_category_id") // This matches the column in the database
    private ItemCategory itemCategory;

    @Column(length = 300,columnDefinition = "NVARCHAR(300)")
    private String name;

    @Column(length = 10000,columnDefinition = "NVARCHAR(max)")
    private String description;

    @Column(name = "reserve_price", precision = 20, scale = 8)
    private BigDecimal reservePrice;

    @Column(name = "buy_in_price", precision = 20, scale = 8)
    private BigDecimal buyInPrice;

    public enum Status {
        QUEUE, IN_AUCTION, SOLD, REMOVED
    }

    @Column(length = 30)
    @Enumerated(EnumType.STRING)
    private Status status;


    @CreationTimestamp
    @Column(name = "create_date")
    private LocalDateTime createDate;

    @UpdateTimestamp
    @Column(name = "update_date")
    private LocalDateTime updateDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private Account owner;

    @Column(length = 30,columnDefinition = "NVARCHAR(30)")
    private String color;

    @Column(length = 30,columnDefinition = "FLOAT")
    private double weight;

    @Column(length = 30,columnDefinition = "NVARCHAR(30)")
    private String metal;

    @Column(length = 30,columnDefinition = "NVARCHAR(30)")
    private String gemstone;

    @Column(length = 30,columnDefinition = "NVARCHAR(30)")
    private String measurement;

    @Column(length = 30,columnDefinition = "NVARCHAR(30)")
    private String condition;

    @Column(length = 30,columnDefinition = "NVARCHAR(30)")
    private String stamped;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "jewelry_id")
    private List<OrderDetail> orderDetails;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "jewelry_id")
    private Set<Attachment> attachments;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consignment_reward_payment_id")
    private Payment consignmentRewardPayment;

    @OneToOne(mappedBy = "createdItem", cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = true)
    private Consignment consignment;

    @Override
    public int hashCode() {
        return itemId;
    }
}
