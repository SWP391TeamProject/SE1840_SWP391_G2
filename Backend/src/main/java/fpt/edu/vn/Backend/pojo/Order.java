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

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "orderId")
@Table(name = "[order]")
public class Order {
    @Id
    @GeneratedValue
    @Column(name = "order_id")
    private int orderId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Account user;

    @Column(name = "order_date")
    private LocalDateTime orderDate;

    @Column(name = "ship_address")
    private String shipAddress;

    @OneToMany

    @JoinColumn(name = "order_id")
    private List<Item> items;

}
