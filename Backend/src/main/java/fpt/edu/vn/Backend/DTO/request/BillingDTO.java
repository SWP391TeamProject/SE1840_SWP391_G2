package fpt.edu.vn.Backend.DTO.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BillingDTO implements Serializable {
    private String vnp_Bill_Mobile;
    private String vnp_Bill_Email;
    private String vnp_Bill_FullName;

    private String vnp_Bill_Address;
    private String vnp_Bill_City;
    private String vnp_Bill_Country;
    private String vnp_Bill_State;

    // Getters and setters for all fields
    // ...
}