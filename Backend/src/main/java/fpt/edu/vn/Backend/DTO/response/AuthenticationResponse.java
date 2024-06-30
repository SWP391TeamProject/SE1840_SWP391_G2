package fpt.edu.vn.Backend.DTO.response;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticationResponse implements Serializable {
    @JsonProperty("access_token")
    String accessToken;
    boolean authenticated;
}
