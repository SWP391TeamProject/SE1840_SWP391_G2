package fpt.edu.vn.Backend.pojo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "[order]")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private int orderId;

    @ManyToMany(fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JoinTable(name = "order_auctionItem",
            joinColumns = @JoinColumn(name = "order_id"),
            inverseJoinColumns = {
                    @JoinColumn(name = "auction_session_id", referencedColumnName = "auction_session_id"),
                    @JoinColumn(name = "item_id", referencedColumnName = "item_id")
            })
    private Set<AuctionItem> auctionItems;

    @Column(name = "shipping_address")
    private String shippingAddress;

    @OneToOne(cascade = CascadeType.MERGE, fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "payment_id")
    private Payment payment;

    @Column(name = "create_date")
    private LocalDateTime createDate;


    @Override
    public int hashCode() {
        return orderId;
    }
}
