package fpt.edu.vn.Backend.service;

import lombok.*;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class DepositRequest {
    private int depositId;
    private int  auctionSessionId;
    private int paymentId;

}