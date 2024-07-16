package fpt.edu.vn.Backend.DTO.internalDTO.citizencardBackImage;

import com.fasterxml.jackson.annotation.*;
import jakarta.annotation.Generated;
import jakarta.validation.Valid;

import java.io.Serializable;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "features",
        "features_prob",
        "issue_date",
        "issue_date_prob",
        "mrz",
        "mrz_prob",
        "overall_score",
        "issue_loc",
        "issue_loc_prob",
        "type_new",
        "type",
        "mrz_details"
})
@Generated("jsonschema2pojo")
public class Data implements Serializable
{

    @JsonProperty("features")
    private String features;
    @JsonProperty("features_prob")
    private String featuresProb;
    @JsonProperty("issue_date")
    private String issueDate;
    @JsonProperty("issue_date_prob")
    private String issueDateProb;
    @JsonProperty("mrz")
    @Valid
    private List<String> mrz;
    @JsonProperty("mrz_prob")
    private String mrzProb;
    @JsonProperty("overall_score")
    private String overallScore;
    @JsonProperty("issue_loc")
    private String issueLoc;
    @JsonProperty("issue_loc_prob")
    private String issueLocProb;
    @JsonProperty("type_new")
    private String typeNew;
    @JsonProperty("type")
    private String type;
    @JsonProperty("mrz_details")
    @Valid
    private MrzDetails mrzDetails;
    @JsonIgnore
    @Valid
    private Map<String, Object> additionalProperties = new LinkedHashMap<String, Object>();
    private final static long serialVersionUID = -3910703206443524601L;

    @JsonProperty("features")
    public String getFeatures() {
        return features;
    }

    @JsonProperty("features")
    public void setFeatures(String features) {
        this.features = features;
    }

    @JsonProperty("features_prob")
    public String getFeaturesProb() {
        return featuresProb;
    }

    @JsonProperty("features_prob")
    public void setFeaturesProb(String featuresProb) {
        this.featuresProb = featuresProb;
    }

    @JsonProperty("issue_date")
    public String getIssueDate() {
        return issueDate;
    }

    @JsonProperty("issue_date")
    public void setIssueDate(String issueDate) {
        this.issueDate = issueDate;
    }

    @JsonProperty("issue_date_prob")
    public String getIssueDateProb() {
        return issueDateProb;
    }

    @JsonProperty("issue_date_prob")
    public void setIssueDateProb(String issueDateProb) {
        this.issueDateProb = issueDateProb;
    }

    @JsonProperty("mrz")
    public List<String> getMrz() {
        return mrz;
    }

    @JsonProperty("mrz")
    public void setMrz(List<String> mrz) {
        this.mrz = mrz;
    }

    @JsonProperty("mrz_prob")
    public String getMrzProb() {
        return mrzProb;
    }

    @JsonProperty("mrz_prob")
    public void setMrzProb(String mrzProb) {
        this.mrzProb = mrzProb;
    }

    @JsonProperty("overall_score")
    public String getOverallScore() {
        return overallScore;
    }

    @JsonProperty("overall_score")
    public void setOverallScore(String overallScore) {
        this.overallScore = overallScore;
    }

    @JsonProperty("issue_loc")
    public String getIssueLoc() {
        return issueLoc;
    }

    @JsonProperty("issue_loc")
    public void setIssueLoc(String issueLoc) {
        this.issueLoc = issueLoc;
    }

    @JsonProperty("issue_loc_prob")
    public String getIssueLocProb() {
        return issueLocProb;
    }

    @JsonProperty("issue_loc_prob")
    public void setIssueLocProb(String issueLocProb) {
        this.issueLocProb = issueLocProb;
    }

    @JsonProperty("type_new")
    public String getTypeNew() {
        return typeNew;
    }

    @JsonProperty("type_new")
    public void setTypeNew(String typeNew) {
        this.typeNew = typeNew;
    }

    @JsonProperty("type")
    public String getType() {
        return type;
    }

    @JsonProperty("type")
    public void setType(String type) {
        this.type = type;
    }

    @JsonProperty("mrz_details")
    public MrzDetails getMrzDetails() {
        return mrzDetails;
    }

    @JsonProperty("mrz_details")
    public void setMrzDetails(MrzDetails mrzDetails) {
        this.mrzDetails = mrzDetails;
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
        sb.append("features");
        sb.append('=');
        sb.append(((this.features == null)?"<null>":this.features));
        sb.append(',');
        sb.append("featuresProb");
        sb.append('=');
        sb.append(((this.featuresProb == null)?"<null>":this.featuresProb));
        sb.append(',');
        sb.append("issueDate");
        sb.append('=');
        sb.append(((this.issueDate == null)?"<null>":this.issueDate));
        sb.append(',');
        sb.append("issueDateProb");
        sb.append('=');
        sb.append(((this.issueDateProb == null)?"<null>":this.issueDateProb));
        sb.append(',');
        sb.append("mrz");
        sb.append('=');
        sb.append(((this.mrz == null)?"<null>":this.mrz));
        sb.append(',');
        sb.append("mrzProb");
        sb.append('=');
        sb.append(((this.mrzProb == null)?"<null>":this.mrzProb));
        sb.append(',');
        sb.append("overallScore");
        sb.append('=');
        sb.append(((this.overallScore == null)?"<null>":this.overallScore));
        sb.append(',');
        sb.append("issueLoc");
        sb.append('=');
        sb.append(((this.issueLoc == null)?"<null>":this.issueLoc));
        sb.append(',');
        sb.append("issueLocProb");
        sb.append('=');
        sb.append(((this.issueLocProb == null)?"<null>":this.issueLocProb));
        sb.append(',');
        sb.append("typeNew");
        sb.append('=');
        sb.append(((this.typeNew == null)?"<null>":this.typeNew));
        sb.append(',');
        sb.append("type");
        sb.append('=');
        sb.append(((this.type == null)?"<null>":this.type));
        sb.append(',');
        sb.append("mrzDetails");
        sb.append('=');
        sb.append(((this.mrzDetails == null)?"<null>":this.mrzDetails));
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
