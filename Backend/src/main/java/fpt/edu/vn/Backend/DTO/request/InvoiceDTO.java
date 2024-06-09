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
public class InvoiceDTO implements Serializable {
    private String vnp_Inv_Phone;
    private String vnp_Inv_Email;
    private String vnp_Inv_Customer;
    private String vnp_Inv_Address;
    private String vnp_Inv_Company;
    private String vnp_Inv_Taxcode;
    private String vnp_Inv_Type;

    // Getters and setters for all fields
    // ...
}