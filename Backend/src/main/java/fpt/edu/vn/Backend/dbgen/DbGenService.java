package fpt.edu.vn.Backend.dbgen;

import com.google.common.collect.HashMultimap;
import com.google.common.collect.Multimap;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import fpt.edu.vn.Backend.pojo.*;
import fpt.edu.vn.Backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.TransactionCallbackWithoutResult;
import org.springframework.transaction.support.TransactionTemplate;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
public class DbGenService {
    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat(
            "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US);

    static {
        DATE_FORMAT.setTimeZone(TimeZone.getTimeZone("ICT"));
    }

    private static final Gson GSON = new Gson();
    private static final File DATA = new File("../gendb/data");
    private static final Logger LOGGER = Logger.getLogger(DbGenService.class.getName());

    @Autowired
    private TransactionTemplate transactionTemplate;
    @Autowired
    private NamedParameterJdbcTemplate jdbcTemplate;
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
    @Autowired
    private AuctionSessionRepos auctionSessionRepos;
    @Autowired
    private AuctionItemRepos auctionItemRepos;
    @Autowired
    private PaymentRepos paymentRepos;

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

    private LocalDateTime parseDate(String createDate) {
        try {
            return DATE_FORMAT.parse(createDate).toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDateTime();
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
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
            account = accountRepos.save(account);
            {
                Map<String, Object> paramMap = new HashMap<>();
                paramMap.put("createDate", parseDate(obj.get("createDate").getAsString()));
                paramMap.put("updateDate", parseDate(obj.get("updateDate").getAsString()));
                paramMap.put("id", account.getAccountId());
                transactionTemplate.execute(new TransactionCallbackWithoutResult() {
                    @Override
                    protected void doInTransactionWithoutResult(TransactionStatus status) {
                        jdbcTemplate.update("UPDATE accounts SET create_date = :createDate, update_date = :updateDate WHERE account_id = :id", paramMap);
                    }
                });
            }

            if (obj.has("citizenCard") && obj.get("citizenCard").isJsonObject()) {
                obj = obj.getAsJsonObject("citizenCard");

                CitizenCard citizenCard = new CitizenCard();
                citizenCard.setUserId(account.getAccountId());
                citizenCard.setAccount(account);
                citizenCard.setCardId(obj.get("cardId").getAsString());
                citizenCard.setFullName(obj.get("fullName").getAsString());
                citizenCard.setBirthday(parseDate(obj.get("birthday").getAsString()).toLocalDate());
                citizenCard.setGender(obj.get("gender").getAsBoolean());
                citizenCard.setAddress(obj.get("address").getAsString());
                citizenCard.setCity(obj.get("city").getAsString());
                account.setCitizenCard(citizenCard);
                citizenCard = citizenCardRepos.save(citizenCard);
                Map<String, Object> paramMap = new HashMap<>();
                paramMap.put("createDate", parseDate(obj.get("createDate").getAsString()));
                paramMap.put("updateDate", parseDate(obj.get("updateDate").getAsString()));
                paramMap.put("id", citizenCard.getUserId());
                transactionTemplate.execute(new TransactionCallbackWithoutResult() {
                    @Override
                    protected void doInTransactionWithoutResult(TransactionStatus status) {
                        jdbcTemplate.update("UPDATE citizen_card SET create_date = :createDate, update_date = :updateDate WHERE account_id = :id", paramMap);
                    }
                });
            }
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
            consignment = consignmentRepos.save(consignment);
            {
                Map<String, Object> paramMap = new HashMap<>();
                paramMap.put("createDate", parseDate(obj.get("createDate").getAsString()));
                paramMap.put("updateDate", parseDate(obj.get("updateDate").getAsString()));
                paramMap.put("id", consignment.getConsignmentId());
                transactionTemplate.execute(new TransactionCallbackWithoutResult() {
                    @Override
                    protected void doInTransactionWithoutResult(TransactionStatus status) {
                        jdbcTemplate.update("UPDATE consignment SET create_date = :createDate, update_date = :updateDate WHERE consignment_id = :id", paramMap);
                    }
                });
            }

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
                    detail = consignmentDetailRepos.save(detail);
                    {
                        Map<String, Object> paramMap = new HashMap<>();
                        paramMap.put("createDate", parseDate(obj.get("createDate").getAsString()));
                        paramMap.put("updateDate", parseDate(obj.get("updateDate").getAsString()));
                        paramMap.put("id", detail.getConsignmentDetailId());
                        transactionTemplate.execute(new TransactionCallbackWithoutResult() {
                            @Override
                            protected void doInTransactionWithoutResult(TransactionStatus status) {

                                jdbcTemplate.update("UPDATE consignment_detail SET create_date = :createDate, update_date = :updateDate WHERE consignment_detail_id = :id", paramMap);
                            }
                        });
                    }


                    if (obj.has("imageURLs") && obj.get("imageURLs").isJsonArray()) {
                        JsonArray imageUrls = obj.getAsJsonArray("imageURLs");
                        for (JsonElement imageUrl : imageUrls) {
                            Attachment attachment = new Attachment();
                            attachment.setLink(imageUrl.getAsString());
                            attachment.setType(Attachment.FileType.JPG);
                            attachment.setBlobId(UUID.randomUUID().toString());
                            attachment.setConsignmentDetail(detail);
                            attachment = attachmentRepos.save(attachment);
                            Map<String, Object> paramMap = new HashMap<>();
                            paramMap.put("createDate", parseDate(obj.get("createDate").getAsString()));
                            paramMap.put("updateDate", parseDate(obj.get("updateDate").getAsString()));
                            paramMap.put("id", attachment.getAttachmentId());
                            transactionTemplate.execute(new TransactionCallbackWithoutResult() {
                                @Override
                                protected void doInTransactionWithoutResult(TransactionStatus status) {
                                    jdbcTemplate.update("UPDATE attachment SET create_date = :createDate, update_date = :updateDate WHERE attachment_id = :id", paramMap);
                                }
                            });
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
            itemCategory = itemCategoryRepos.save(itemCategory);
            Map<String, Object> paramMap = new HashMap<>();
            paramMap.put("createDate", parseDate(obj.get("createDate").getAsString()));
            paramMap.put("updateDate", parseDate(obj.get("updateDate").getAsString()));
            paramMap.put("id", itemCategory.getItemCategoryId());
            transactionTemplate.execute(new TransactionCallbackWithoutResult() {
                @Override
                protected void doInTransactionWithoutResult(TransactionStatus status) {
                    jdbcTemplate.update("UPDATE item_category SET create_date = :createDate, update_date = :updateDate WHERE item_category_id = :id", paramMap);
                }
            });
        }
    }

    private void generateItem(JsonArray e) {
        LOGGER.info("Generate items...");
        for (JsonElement element : e) {
            JsonObject obj = element.getAsJsonObject();
            Item item = new Item();
            item.setItemId(obj.get("id").getAsInt());
            item.setItemCategory(itemCategoryRepos.findById(obj.get("categoryId").getAsInt()).get());
            item.setName(obj.get("name").getAsString());
            item.setDescription(obj.get("description").getAsString());
            item.setReservePrice(obj.get("reservePrice").getAsBigDecimal());
            item.setBuyInPrice(obj.get("buyInPrice").getAsBigDecimal());
            item.setStatus(Item.Status.valueOf(obj.get("status").getAsString()));
            item.setOwner(accountRepos.findById(obj.get("ownerId").getAsInt()).get());
            item = itemRepos.save(item);
            {
                Map<String, Object> paramMap = new HashMap<>();
                paramMap.put("createDate", parseDate(obj.get("createDate").getAsString()));
                paramMap.put("updateDate", parseDate(obj.get("updateDate").getAsString()));
                paramMap.put("id", item.getItemId());
                transactionTemplate.execute(new TransactionCallbackWithoutResult() {
                    @Override
                    protected void doInTransactionWithoutResult(TransactionStatus status) {
                        jdbcTemplate.update("UPDATE item SET create_date = :createDate, update_date = :updateDate WHERE item_id = :id", paramMap);
                    }
                });
            }

            if (obj.has("imageURLs") && obj.get("imageURLs").isJsonArray()) {
                JsonArray imageUrls = obj.getAsJsonArray("imageURLs");
                for (JsonElement imageUrl : imageUrls) {
                    Attachment attachment = new Attachment();
                    attachment.setLink(imageUrl.getAsString());
                    attachment.setType(Attachment.FileType.JPG);
                    attachment.setBlobId(UUID.randomUUID().toString());
                    attachment.setItem(item);
                    attachment = attachmentRepos.save(attachment);
                    Map<String, Object> paramMap = new HashMap<>();
                    paramMap.put("createDate", parseDate(obj.get("createDate").getAsString()));
                    paramMap.put("updateDate", parseDate(obj.get("updateDate").getAsString()));
                    paramMap.put("id", attachment.getAttachmentId());
                    transactionTemplate.execute(new TransactionCallbackWithoutResult() {
                        @Override
                        protected void doInTransactionWithoutResult(TransactionStatus status) {
                            jdbcTemplate.update("UPDATE attachment SET create_date = :createDate, update_date = :updateDate WHERE attachment_id = :id", paramMap);
                        }
                    });
                }
            }
        }
    }

    private void generateAuction(JsonArray e) {
        LOGGER.info("Generate auctions...");
        for (JsonElement element : e) {
            JsonObject obj = element.getAsJsonObject();
            AuctionSession auctionSession = new AuctionSession();
            auctionSession.setAuctionSessionId(obj.get("id").getAsInt());
            auctionSession.setTitle(obj.get("title").getAsString());
            auctionSession.setStartDate(parseDate(obj.get("startDate").getAsString()));
            auctionSession.setEndDate(parseDate(obj.get("endDate").getAsString()));
            auctionSession.setStatus(AuctionSession.Status.valueOf(obj.get("status").getAsString()));
            auctionSession = auctionSessionRepos.save(auctionSession);
            {
                Map<String, Object> paramMap = new HashMap<>();
                paramMap.put("createDate", parseDate(obj.get("createDate").getAsString()));
                paramMap.put("updateDate", parseDate(obj.get("updateDate").getAsString()));
                paramMap.put("id", auctionSession.getAuctionSessionId());
                transactionTemplate.execute(new TransactionCallbackWithoutResult() {
                    @Override
                    protected void doInTransactionWithoutResult(TransactionStatus status) {
                        jdbcTemplate.update("UPDATE auction_session SET create_date = :createDate, update_date = :updateDate WHERE auction_session_id = :id", paramMap);
                    }
                });
            }

            if (obj.has("imageURLs") && obj.get("imageURLs").isJsonArray()) {
                JsonArray imageUrls = obj.getAsJsonArray("imageURLs");
                for (JsonElement imageUrl : imageUrls) {
                    Attachment attachment = new Attachment();
                    attachment.setLink(imageUrl.getAsString());
                    attachment.setType(Attachment.FileType.JPG);
                    attachment.setBlobId(UUID.randomUUID().toString());
                    attachment.setAuctionSession(auctionSession);
                    attachment = attachmentRepos.save(attachment);
                    {
                        Map<String, Object> paramMap = new HashMap<>();
                        paramMap.put("createDate", parseDate(obj.get("createDate").getAsString()));
                        paramMap.put("updateDate", parseDate(obj.get("updateDate").getAsString()));
                        paramMap.put("id", attachment.getAttachmentId());
                        transactionTemplate.execute(new TransactionCallbackWithoutResult() {
                            @Override
                            protected void doInTransactionWithoutResult(TransactionStatus status) {
                                jdbcTemplate.update("UPDATE attachment SET create_date = :createDate, update_date = :updateDate WHERE attachment_id = :id", paramMap);
                            }
                        });
                    }
                }
            }

            if (obj.has("items") && obj.get("items").isJsonArray()) {
                JsonArray items = obj.getAsJsonArray("items");
                for (JsonElement item : items) {
                    obj = item.getAsJsonObject();
                    AuctionItem auctionItem = new AuctionItem();
                    auctionItem.setAuctionItemId(new AuctionItemId(auctionSession.getAuctionSessionId(), obj.get("itemId").getAsInt()));
                    auctionItem.setAuctionSession(auctionSession);
                    auctionItem.setItem(itemRepos.findById(obj.get("itemId").getAsInt()).get());
                    auctionItem.setCurrentPrice(obj.get("currentPrice").getAsBigDecimal());
                    auctionItem = auctionItemRepos.save(auctionItem);
                    {
                        Map<String, Object> paramMap = new HashMap<>();
                        paramMap.put("createDate", parseDate(obj.get("createDate").getAsString()));
                        paramMap.put("updateDate", parseDate(obj.get("updateDate").getAsString()));
                        paramMap.put("id1", auctionItem.getAuctionItemId().getAuctionSessionId());
                        paramMap.put("id2", auctionItem.getAuctionItemId().getItemId());
                        transactionTemplate.execute(new TransactionCallbackWithoutResult() {
                            @Override
                            protected void doInTransactionWithoutResult(TransactionStatus status) {
                                jdbcTemplate.update("UPDATE auction_item SET create_date = :createDate, update_date = :updateDate WHERE auction_session_id = :id1 AND item_id = :id2", paramMap);
                            }
                        });
                    }
                }
            }
        }
    }

    private void generateTransaction(JsonArray e) {
        LOGGER.info("Generate transactions...");
        Multimap<Integer, Integer> depositSet = HashMultimap.create();
        for (JsonElement element : e) {
            JsonObject obj = element.getAsJsonObject();
            Payment payment = new Payment();
            payment.setPaymentId(obj.get("id").getAsInt());
            payment.setPaymentAmount(obj.get("amount").getAsBigDecimal());
            payment.setStatus(Payment.Status.valueOf(obj.get("status").getAsString()));
            payment.setType(Payment.Type.valueOf(obj.get("type").getAsString()));
            payment.setAccount(accountRepos.findById(obj.get("accountId").getAsInt()).get());

            if (payment.getType() == Payment.Type.AUCTION_DEPOSIT) {
                JsonObject auctionItem = obj.getAsJsonObject("auctionItem");
                int auctionId = auctionItem.get("auctionId").getAsInt();
                if (depositSet.get(auctionId).contains(obj.get("accountId").getAsInt())) {
                    continue;
                }
                depositSet.put(auctionId, obj.get("accountId").getAsInt());
            }

            payment = paymentRepos.save(payment);
            {
                Map<String, Object> paramMap = new HashMap<>();
                paramMap.put("createDate", parseDate(obj.get("createDate").getAsString()));
                paramMap.put("id", payment.getPaymentId());
                transactionTemplate.execute(new TransactionCallbackWithoutResult() {
                    @Override
                    protected void doInTransactionWithoutResult(TransactionStatus status) {
                        jdbcTemplate.update("UPDATE payment SET create_date = :createDate WHERE payment_id = :id", paramMap);
                    }
                });
            }

            switch (payment.getType()) {
                case AUCTION_BID -> {
                    JsonObject auctionItem = obj.getAsJsonObject("auctionItem");
                    Bid bid = new Bid();
                    bid.setAuctionItem(auctionItemRepos.findById(new AuctionItemId(
                                    auctionItem.get("auctionId").getAsInt(),
                                    auctionItem.get("itemId").getAsInt()
                            )
                    ).get());
                    bid.setPayment(payment);
                    payment.setBid(bid);
                    paymentRepos.save(payment);
                }
                case AUCTION_DEPOSIT -> {
                    JsonObject auctionItem = obj.getAsJsonObject("auctionItem");
                    Deposit deposit = new Deposit();
                    deposit.setAuctionSession(auctionSessionRepos.findById(auctionItem.get("auctionId").getAsInt()).get());
                    deposit.setPayment(payment);
                    payment.setDeposit(deposit);
                    paymentRepos.save(payment);
                }
                case AUCTION_ORDER -> {
                    JsonObject auctionItem = obj.getAsJsonObject("auctionItem");
                    Order order = new Order();
                    order.setItems(itemRepos.findById(auctionItem.get("itemId").getAsInt()).stream().collect(Collectors.toSet()));
                    order.setPayment(payment);
                    payment.setOrder(order);
                    paymentRepos.save(payment);
                }
            }
        }
    }

}
