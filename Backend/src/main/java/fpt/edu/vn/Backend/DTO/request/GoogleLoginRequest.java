package fpt.edu.vn.Backend.DTO.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class GoogleLoginRequest implements Serializable {
    private String credential;
    private String clientId;
    private String select_by;

    // Getters and setters
}