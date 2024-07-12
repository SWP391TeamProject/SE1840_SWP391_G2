package fpt.edu.vn.Backend.DTO.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@Getter
@Setter
public class UpdateStatusAuctionSessionRequestDTO {
    private List<Integer> auctionSessionId;
    private String status;
}
