package fpt.edu.vn.Backend.DTO.request;

import lombok.*;

import java.io.Serializable;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class DepositRequest implements Serializable {
    private int depositId;
    private int  auctionSessionId;
    private int paymentId;

}