package fpt.edu.vn.Backend.DTO.internalDTO;

import com.fasterxml.jackson.annotation.*;
import jakarta.validation.Valid;

import javax.annotation.processing.Generated;
import java.io.Serializable;
import java.util.LinkedHashMap;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "id",
        "id_prob",
        "name",
        "name_prob",
        "dob",
        "dob_prob",
        "sex",
        "sex_prob",
        "nationality",
        "nationality_prob",
        "home",
        "home_prob",
        "address",
        "address_prob",
        "address_entities",
        "doe",
        "doe_prob",
        "type"
})
@Generated("jsonschema2pojo")
public class Data implements Serializable
{

    @JsonProperty("id")
    private String id;
    @JsonProperty("id_prob")
    private String idProb;
    @JsonProperty("name")
    private String name;
    @JsonProperty("name_prob")
    private String nameProb;
    @JsonProperty("dob")
    private String dob;
    @JsonProperty("dob_prob")
    private String dobProb;
    @JsonProperty("sex")
    private String sex;
    @JsonProperty("sex_prob")
    private String sexProb;
    @JsonProperty("nationality")
    private String nationality;
    @JsonProperty("nationality_prob")
    private String nationalityProb;
    @JsonProperty("home")
    private String home;
    @JsonProperty("home_prob")
    private String homeProb;
    @JsonProperty("address")
    private String address;
    @JsonProperty("address_prob")
    private String addressProb;
    @JsonProperty("address_entities")
    @Valid
    private AddressEntities addressEntities;
    @JsonProperty("doe")
    private String doe;
    @JsonProperty("doe_prob")
    private String doeProb;
    @JsonProperty("type")
    private String type;
    @JsonIgnore
    @Valid
    private Map<String, Object> additionalProperties = new LinkedHashMap<String, Object>();
    private final static long serialVersionUID = -6441024500819354497L;

    @JsonProperty("id")
    public String getId() {
        return id;
    }

    @JsonProperty("id")
    public void setId(String id) {
        this.id = id;
    }

    @JsonProperty("id_prob")
    public String getIdProb() {
        return idProb;
    }

    @JsonProperty("id_prob")
    public void setIdProb(String idProb) {
        this.idProb = idProb;
    }

    @JsonProperty("name")
    public String getName() {
        return name;
    }

    @JsonProperty("name")
    public void setName(String name) {
        this.name = name;
    }

    @JsonProperty("name_prob")
    public String getNameProb() {
        return nameProb;
    }

    @JsonProperty("name_prob")
    public void setNameProb(String nameProb) {
        this.nameProb = nameProb;
    }

    @JsonProperty("dob")
    public String getDob() {
        return dob;
    }

    @JsonProperty("dob")
    public void setDob(String dob) {
        this.dob = dob;
    }

    @JsonProperty("dob_prob")
    public String getDobProb() {
        return dobProb;
    }

    @JsonProperty("dob_prob")
    public void setDobProb(String dobProb) {
        this.dobProb = dobProb;
    }

    @JsonProperty("sex")
    public String getSex() {
        return sex;
    }

    @JsonProperty("sex")
    public void setSex(String sex) {
        this.sex = sex;
    }

    @JsonProperty("sex_prob")
    public String getSexProb() {
        return sexProb;
    }

    @JsonProperty("sex_prob")
    public void setSexProb(String sexProb) {
        this.sexProb = sexProb;
    }

    @JsonProperty("nationality")
    public String getNationality() {
        return nationality;
    }

    @JsonProperty("nationality")
    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    @JsonProperty("nationality_prob")
    public String getNationalityProb() {
        return nationalityProb;
    }

    @JsonProperty("nationality_prob")
    public void setNationalityProb(String nationalityProb) {
        this.nationalityProb = nationalityProb;
    }

    @JsonProperty("home")
    public String getHome() {
        return home;
    }

    @JsonProperty("home")
    public void setHome(String home) {
        this.home = home;
    }

    @JsonProperty("home_prob")
    public String getHomeProb() {
        return homeProb;
    }

    @JsonProperty("home_prob")
    public void setHomeProb(String homeProb) {
        this.homeProb = homeProb;
    }

    @JsonProperty("address")
    public String getAddress() {
        return address;
    }

    @JsonProperty("address")
    public void setAddress(String address) {
        this.address = address;
    }

    @JsonProperty("address_prob")
    public String getAddressProb() {
        return addressProb;
    }

    @JsonProperty("address_prob")
    public void setAddressProb(String addressProb) {
        this.addressProb = addressProb;
    }

    @JsonProperty("address_entities")
    public AddressEntities getAddressEntities() {
        return addressEntities;
    }

    @JsonProperty("address_entities")
    public void setAddressEntities(AddressEntities addressEntities) {
        this.addressEntities = addressEntities;
    }

    @JsonProperty("doe")
    public String getDoe() {
        return doe;
    }

    @JsonProperty("doe")
    public void setDoe(String doe) {
        this.doe = doe;
    }

    @JsonProperty("doe_prob")
    public String getDoeProb() {
        return doeProb;
    }

    @JsonProperty("doe_prob")
    public void setDoeProb(String doeProb) {
        this.doeProb = doeProb;
    }

    @JsonProperty("type")
    public String getType() {
        return type;
    }

    @JsonProperty("type")
    public void setType(String type) {
        this.type = type;
    }

    @JsonAnyGetter
    public Map<String, Object> getAdditionalProperties() {
        return this.additionalProperties;
    }

    @JsonAnySetter
    public void setAdditionalProperty(String name, Object value) {
        this.additionalProperties.put(name, value);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(Data.class.getName()).append('@').append(Integer.toHexString(System.identityHashCode(this))).append('[');
        sb.append("id");
        sb.append('=');
        sb.append(((this.id == null)?"<null>":this.id));
        sb.append(',');
        sb.append("idProb");
        sb.append('=');
        sb.append(((this.idProb == null)?"<null>":this.idProb));
        sb.append(',');
        sb.append("name");
        sb.append('=');
        sb.append(((this.name == null)?"<null>":this.name));
        sb.append(',');
        sb.append("nameProb");
        sb.append('=');
        sb.append(((this.nameProb == null)?"<null>":this.nameProb));
        sb.append(',');
        sb.append("dob");
        sb.append('=');
        sb.append(((this.dob == null)?"<null>":this.dob));
        sb.append(',');
        sb.append("dobProb");
        sb.append('=');
        sb.append(((this.dobProb == null)?"<null>":this.dobProb));
        sb.append(',');
        sb.append("sex");
        sb.append('=');
        sb.append(((this.sex == null)?"<null>":this.sex));
        sb.append(',');
        sb.append("sexProb");
        sb.append('=');
        sb.append(((this.sexProb == null)?"<null>":this.sexProb));
        sb.append(',');
        sb.append("nationality");
        sb.append('=');
        sb.append(((this.nationality == null)?"<null>":this.nationality));
        sb.append(',');
        sb.append("nationalityProb");
        sb.append('=');
        sb.append(((this.nationalityProb == null)?"<null>":this.nationalityProb));
        sb.append(',');
        sb.append("home");
        sb.append('=');
        sb.append(((this.home == null)?"<null>":this.home));
        sb.append(',');
        sb.append("homeProb");
        sb.append('=');
        sb.append(((this.homeProb == null)?"<null>":this.homeProb));
        sb.append(',');
        sb.append("address");
        sb.append('=');
        sb.append(((this.address == null)?"<null>":this.address));
        sb.append(',');
        sb.append("addressProb");
        sb.append('=');
        sb.append(((this.addressProb == null)?"<null>":this.addressProb));
        sb.append(',');
        sb.append("addressEntities");
        sb.append('=');
        sb.append(((this.addressEntities == null)?"<null>":this.addressEntities));
        sb.append(',');
        sb.append("doe");
        sb.append('=');
        sb.append(((this.doe == null)?"<null>":this.doe));
        sb.append(',');
        sb.append("doeProb");
        sb.append('=');
        sb.append(((this.doeProb == null)?"<null>":this.doeProb));
        sb.append(',');
        sb.append("type");
        sb.append('=');
        sb.append(((this.type == null)?"<null>":this.type));
        sb.append(',');
        sb.append("additionalProperties");
        sb.append('=');
        sb.append(((this.additionalProperties == null)?"<null>":this.additionalProperties));
        sb.append(',');
        if (sb.charAt((sb.length()- 1)) == ',') {
            sb.setCharAt((sb.length()- 1), ']');
        } else {
            sb.append(']');
        }
        return sb.toString();
    }

}
