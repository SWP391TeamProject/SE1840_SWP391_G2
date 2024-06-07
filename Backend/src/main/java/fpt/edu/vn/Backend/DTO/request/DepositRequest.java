package fpt.edu.vn.Backend.DTO.request;

import fpt.edu.vn.Backend.DTO.PaymentDTO;
import fpt.edu.vn.Backend.pojo.AuctionItemId;
import lombok.*;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class DepositRequest {
    private int depositId;
    private AuctionItemId auctionItemId;
    private int paymentId;

}
