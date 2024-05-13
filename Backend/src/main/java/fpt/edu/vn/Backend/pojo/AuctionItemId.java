package fpt.edu.vn.Backend.pojo;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class AuctionItemId implements Serializable {
    private int auctionSessionId;
    private int itemId;
}
