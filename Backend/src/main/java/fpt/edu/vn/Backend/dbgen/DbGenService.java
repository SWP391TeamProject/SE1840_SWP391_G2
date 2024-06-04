package fpt.edu.vn.Backend.dbgen;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import fpt.edu.vn.Backend.pojo.*;
import fpt.edu.vn.Backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Locale;
import java.util.TimeZone;
import java.util.UUID;
import java.util.logging.Logger;

@Service
public class DbGenService {
    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat(
            "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US);

    static {
        DATE_FORMAT.setTimeZone(TimeZone.getTimeZone("ICT"));
    }

    private static final Gson GSON = new Gson();
    private static final File DATA = new File("./gendb/data");
    private static final Logger LOGGER = Logger.getLogger(DbGenService.class.getName());

    @Autowired
    private AccountRepos accountRepos;
    @Autowired
    private CitizenCardRepos citizenCardRepos;
    @Autowired
    private ConsignmentRepos consignmentRepos;
    @Autowired
    private ConsignmentDetailRepos consignmentDetailRepos;
    @Autowired
    private AttachmentRepos attachmentRepos;
    @Autowired
    private ItemCategoryRepos itemCategoryRepos;
    @Autowired
    private ItemRepos itemRepos;

    public void generate() throws IOException {
        LOGGER.info("Generate database...");

        generateAccount(parse("account.json"));
        generateConsignment(parse("consignment.json"));
        generateItemCategory(parse("item_category.json"));
        generateItem(parse("item.json"));
        generateAuction(parse("auction_session.json"));
        generateTransaction(parse("transaction.json"));

        System.exit(0);
    }

    private JsonArray parse(String path) throws IOException {
        return GSON.fromJson(Files.readString(new File(DATA, path).toPath()), JsonArray.class);
    }

    private void generateAccount(JsonArray e) {
        LOGGER.info("Generate accounts...");
        for (JsonElement element : e) {
            JsonObject obj = element.getAsJsonObject();

            Account account = new Account();
            account.setAccountId(obj.get("id").getAsInt());
            account.setNickname(obj.get("nickname").getAsString());
            account.setRole(Account.Role.valueOf(obj.get("role").getAsString()));
            account.setEmail(obj.get("email").getAsString());
            account.setPhone(obj.get("phone").getAsString());
            account.setPassword(obj.get("password").getAsString());
            account.setStatus(Account.Status.valueOf(obj.get("status").getAsString()));
            account.setBalance(obj.get("balance").getAsBigDecimal());
            account.setCreateDate(parseDate(obj.get("createDate").getAsString()));
            account.setUpdateDate(parseDate(obj.get("updateDate").getAsString()));
            account = accountRepos.save(account);

            if (obj.has("citizenCard") && obj.get("citizenCard").isJsonObject()) {
                obj = obj.getAsJsonObject("citizenCard");

                CitizenCard citizenCard = new CitizenCard();
                citizenCard.setAccount(account);
                citizenCard.setCardId(obj.get("cardId").getAsString());
                citizenCard.setFullName(obj.get("fullName").getAsString());
                citizenCard.setBirthday(parseDate(obj.get("birthday").getAsString()).toLocalDate());
                citizenCard.setGender(obj.get("gender").getAsBoolean());
                citizenCard.setAddress(obj.get("address").getAsString());
                citizenCard.setCity(obj.get("city").getAsString());
                citizenCard.setCreateDate(parseDate(obj.get("createDate").getAsString()));
                citizenCard.setUpdateDate(parseDate(obj.get("updateDate").getAsString()));
                account.setCitizenCard(citizenCard);
            }
        }
    }

    private LocalDateTime parseDate(String createDate) {
        try {
            return DATE_FORMAT.parse(createDate).toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDateTime();
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }

    private void generateConsignment(JsonArray e) {
        LOGGER.info("Generate consignments...");
        for (JsonElement element : e) {
            JsonObject obj = element.getAsJsonObject();
            Consignment consignment = new Consignment();
            consignment.setConsignmentId(obj.get("id").getAsInt());
            consignment.setStaff(accountRepos.findById(obj.get("staffId").getAsInt()).get());
            consignment.setStatus(Consignment.Status.valueOf(obj.get("status").getAsString()));
            consignment.setPreferContact(Consignment.preferContact.valueOf(obj.get("preferContact").getAsString()));
            consignment.setCreateDate(parseDate(obj.get("createDate").getAsString()));
            consignment.setUpdateDate(parseDate(obj.get("updateDate").getAsString()));
            consignment = consignmentRepos.save(consignment);

            int senderId = obj.get("senderId").getAsInt();
            
            if (obj.has("details") && obj.get("details").isJsonArray()) {
                JsonArray consignmentDetails = obj.getAsJsonArray("details");
                for (JsonElement consignmentDetail : consignmentDetails) {
                    obj = consignmentDetail.getAsJsonObject();
                    ConsignmentDetail detail = new ConsignmentDetail();
                    detail.setConsignment(consignment);
                    detail.setAccount(accountRepos.findById(senderId).get());
                    detail.setDescription(obj.get("description").getAsString());
                    detail.setStatus(ConsignmentDetail.ConsignmentStatus.valueOf(obj.get("status").getAsString()));
                    detail.setPrice(obj.get("price").getAsBigDecimal());
                    detail.setCreateDate(parseDate(obj.get("createDate").getAsString()));
                    detail.setUpdateDate(parseDate(obj.get("updateDate").getAsString()));
                    consignmentDetailRepos.save(detail);

                    if (obj.has("imageUrls") && obj.get("imageUrls").isJsonArray()) {
                        JsonArray imageUrls = obj.getAsJsonArray("imageUrls");
                        for (JsonElement imageUrl : imageUrls) {
                            Attachment attachment = new Attachment();
                            attachment.setLink(imageUrl.getAsString());
                            attachment.setBlobId(UUID.randomUUID().toString());
                            attachment.setCreateDate(detail.getCreateDate());
                            attachment.setUpdateDate(detail.getUpdateDate());
                            attachment.setConsignmentDetail(detail);
                            attachmentRepos.save(attachment);
                        }
                    }
                }
            }
        }
    }

    private void generateItemCategory(JsonArray e) {
        LOGGER.info("Generate item categories...");
        for (JsonElement element : e) {
            JsonObject obj = element.getAsJsonObject();
            ItemCategory itemCategory = new ItemCategory();
            itemCategory.setItemCategoryId(obj.get("id").getAsInt());
            itemCategory.setName(obj.get("name").getAsString());
            itemCategory.setCreateDate(parseDate(obj.get("createDate").getAsString()));
            itemCategory.setUpdateDate(parseDate(obj.get("updateDate").getAsString()));
            itemCategoryRepos.save(itemCategory);
        }
    }

    private void generateItem(JsonArray e) {
        LOGGER.info("Generate items...");
        for (JsonElement element : e) {
            JsonObject obj = element.getAsJsonObject();
            Item item = new Item();
            item.setItemId(obj.get("id").getAsInt());
            item.setItemCategory(obj.get("itemCategoryId").getAsInt());
            item.setName(obj.get("name").getAsString());
            item.setCreateDate(parseDate(obj.get("createDate").getAsString()));
            item.setUpdateDate(parseDate(obj.get("updateDate").getAsString()));
            itemRepos.save(item);
        }
    }

    private void generateAuction(JsonArray e) {

    }

    private void generateTransaction(JsonArray e) {

    }

}
