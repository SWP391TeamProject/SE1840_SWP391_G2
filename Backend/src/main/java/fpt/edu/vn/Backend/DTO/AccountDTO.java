package fpt.edu.vn.Backend.DTO;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@ToString
public class AccountDTO {
    private Integer accountId;
    private String nickname;
    private AttachmentDTO avatar;
    private List<Integer> role;
    private String email;
    private String phone;
    private Byte status;
    private BigDecimal balance;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;
}