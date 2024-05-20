package fpt.edu.vn.Backend.pojo;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "[order]")
public class Order {
    @Id
    @GeneratedValue
    @Column(name = "order_id")
    private int orderId;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

    @Column(name = "order_date")
    private LocalDateTime orderDate;

    @Column(name = "ship_address")
    private String shipAddress;

    @OneToMany

    @JoinColumn(name = "order_id")
    private List<Item> items;

    @OneToMany
    @JoinColumn(name = "order_id")
    private Set<Payment> payments;

}
