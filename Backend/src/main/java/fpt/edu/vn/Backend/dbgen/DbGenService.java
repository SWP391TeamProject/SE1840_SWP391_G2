package fpt.edu.vn.Backend.dbgen;

import com.google.common.collect.HashMultimap;
import com.google.common.collect.Multimap;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import fpt.edu.vn.Backend.pojo.*;
import fpt.edu.vn.Backend.repository.*;
import fpt.edu.vn.Backend.security.PasswordEncoderConfig;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.apache.commons.math3.util.Pair;
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
    private static File DATA;

    static {
        DATE_FORMAT.setTimeZone(TimeZone.getTimeZone("ICT"));
    }

    private static final Gson GSON = new Gson();
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
    @Autowired
    private NotificationRepos notificationRepos;

    @Autowired
    private PasswordEncoderConfig passwordEncoderConfig;

    public void generate() throws IOException {
        DATA = new File("../gendb/output");
        if (!DATA.exists())
            DATA = new File("./gendb/output");
        if (!DATA.exists()) {
            System.err.println("Data not found");
            System.exit(1);
        }

        LOGGER.info("Generate database...");

        generateAccount(loadArray("account.json"));
        generateConsignment(loadArray("consignment.json"));
        generateItemCategory(loadArray("item_category.json"));
        generateItem(loadArray("item.json"));
        generateAuction(loadArray("auction_session.json"));
        generateTransaction(loadArray("transaction.json"));
        generateNotification(loadObject("notification.json"));

        System.exit(0);
    }

    private JsonArray loadArray(String path) throws IOException {
        return GSON.fromJson(Files.readString(new File(DATA, path).toPath()), JsonArray.class);
    }

    private JsonObject loadObject(String path) throws IOException {
        return GSON.fromJson(Files.readString(new File(DATA, path).toPath()), JsonObject.class);
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
        if (accountRepos.count() > 0) {
            LOGGER.info(String.format("Skipped generating accounts: %d/%d exists", accountRepos.count(), e.size()));
            return;
        }
        LOGGER.info("Generate accounts...");

        Map<Integer, Account> preparedAccounts = new HashMap<>();
        Map<Integer, CitizenCard> preparedCards = new HashMap<>();

        for (JsonElement element : e) {
            JsonObject obj = element.getAsJsonObject();

            Account account = new Account();
            account.setAccountId(obj.get("id").getAsInt());
            account.setNickname(obj.get("nickname").getAsString());
            account.setRole(Account.Role.valueOf(obj.get("role").getAsString()));
            account.setEmail(obj.get("email").getAsString());
            account.setPhone(obj.get("phone").getAsString());
            account.setPassword(passwordEncoderConfig.bcryptEncoder().encode(obj.get("password").getAsString()));
            account.setStatus(Account.Status.valueOf(obj.get("status").getAsString()));
            account.setBalance(obj.get("balance").getAsBigDecimal());
            account.setCreateDate(parseDate(obj.get("createDate").getAsString()));
            account.setUpdateDate(parseDate(obj.get("updateDate").getAsString()));
            preparedAccounts.put(account.getAccountId(), account);

            if (obj.has("citizenCard") && obj.get("citizenCard").isJsonObject()) {
                obj = obj.getAsJsonObject("citizenCard");

                CitizenCard citizenCard = new CitizenCard();
                citizenCard.setUserId(account.getAccountId());
                citizenCard.setCardId(obj.get("cardId").getAsString());
                citizenCard.setFullName(obj.get("fullName").getAsString());
                citizenCard.setBirthday(parseDate(obj.get("birthday").getAsString()).toLocalDate());
                citizenCard.setGender(obj.get("gender").getAsBoolean());
                citizenCard.setAddress(obj.get("address").getAsString());
                citizenCard.setCity(obj.get("city").getAsString());
                citizenCard.setCreateDate(parseDate(obj.get("createDate").getAsString()));
                citizenCard.setUpdateDate(parseDate(obj.get("updateDate").getAsString()));
                preparedCards.put(citizenCard.getUserId(), citizenCard);
            }
        }

        ///////////////////////////

        Map<String, Object>[] accountParams = new Map[preparedAccounts.size()];
        int i = 0;
        for (Account account : preparedAccounts.values()) {
            accountParams[i++] = Map.of(
                    "createDate", account.getCreateDate(),
                    "updateDate", account.getUpdateDate(),
                    "id", account.getAccountId()
            );
        }

        for (Account account : accountRepos.saveAllAndFlush(preparedAccounts.values())) {
            preparedAccounts.put(account.getAccountId(), account);
        }

        transactionTemplate.execute(status -> jdbcTemplate.batchUpdate("UPDATE accounts SET create_date = :createDate, update_date = :updateDate WHERE account_id = :id", accountParams));

        /////////////////////////

        Map<String, Object>[] cardParams = new Map[preparedCards.size()];
        i = 0;
        for (CitizenCard card : preparedCards.values()) {
            cardParams[i++] = Map.of(
                    "createDate", card.getCreateDate(),
                    "updateDate", card.getUpdateDate(),
                    "id", card.getUserId()
            );
            Account account = preparedAccounts.get(card.getUserId());
            if (account != null) {
                card.setAccount(account);
                account.setCitizenCard(card);
            }
        }

        for (CitizenCard card : citizenCardRepos.saveAllAndFlush(preparedCards.values())) {
            preparedCards.put(card.getUserId(), card);
        }

        transactionTemplate.execute(status -> jdbcTemplate.batchUpdate("UPDATE citizen_card SET create_date = :createDate, update_date = :updateDate WHERE account_id = :id", cardParams));
    }

    private void generateConsignment(JsonArray e) {
        if (consignmentRepos.count() > 0) {
            LOGGER.info(String.format("Skipped generating consignments: %d/%d exists", consignmentRepos.count(), e.size()));
            return;
        }
        LOGGER.info("Generate consignments...");

        @Data
        @AllArgsConstructor
        class Tuple {
            ConsignmentDetail first;
            Attachment[] second;
        }

        Map<Integer, Consignment> preparedConsignments = new HashMap<>();
        Map<Integer, Tuple> preparedConsignmentDetails = new HashMap<>();
        int consignmentDetailId = 1;

        for (JsonElement element : e) {
            JsonObject obj = element.getAsJsonObject();
            Consignment consignment = new Consignment();
            consignment.setConsignmentId(obj.get("id").getAsInt());
            consignment.setStaff(accountRepos.getReferenceById(obj.get("staffId").getAsInt()));
            consignment.setStatus(Consignment.Status.valueOf(obj.get("status").getAsString()));
            consignment.setPreferContact(Consignment.preferContact.valueOf(obj.get("preferContact").getAsString()));
            consignment.setCreateDate(parseDate(obj.get("createDate").getAsString()));
            consignment.setUpdateDate(parseDate(obj.get("updateDate").getAsString()));
            preparedConsignments.put(consignment.getConsignmentId(), consignment);

            if (obj.has("details") && obj.get("details").isJsonArray()) {
                int senderId = obj.get("senderId").getAsInt();
                for (JsonElement consignmentDetail : obj.getAsJsonArray("details")) {
                    obj = consignmentDetail.getAsJsonObject();
                    ConsignmentDetail detail = new ConsignmentDetail();
                    detail.setConsignmentDetailId(consignmentDetailId++);
                    detail.setConsignment(consignment);
                    detail.setAccount(accountRepos.getReferenceById(senderId));
                    detail.setDescription(obj.get("description").getAsString());
                    detail.setStatus(ConsignmentDetail.ConsignmentStatus.valueOf(obj.get("status").getAsString()));
                    detail.setPrice(obj.get("price").getAsBigDecimal());
                    detail.setCreateDate(parseDate(obj.get("createDate").getAsString()));
                    detail.setUpdateDate(parseDate(obj.get("updateDate").getAsString()));

                    List<Attachment> attachments = new ArrayList<>();

                    if (obj.has("imageURLs") && obj.get("imageURLs").isJsonArray()) {
                        JsonArray imageUrls = obj.getAsJsonArray("imageURLs");
                        for (JsonElement imageUrl : imageUrls) {
                            Attachment attachment = new Attachment();
                            attachment.setLink(imageUrl.getAsString());
                            attachment.setType(Attachment.FileType.JPG);
                            attachment.setBlobId(UUID.randomUUID().toString());
                            attachment.setCreateDate(parseDate(obj.get("createDate").getAsString()));
                            attachment.setUpdateDate(parseDate(obj.get("updateDate").getAsString()));
                            attachments.add(attachment);
                        }
                    }

                    preparedConsignmentDetails.put(detail.getConsignmentDetailId(), new Tuple(
                            detail,
                            attachments.toArray(Attachment[]::new)
                    ));
                }
            }
        }

        /////////////////////////////////////

        Map<String, Object>[] consignmentParams = new Map[preparedConsignments.size()];
        int i = 0;
        for (Consignment csn : preparedConsignments.values()) {
            consignmentParams[i++] = Map.of(
                    "createDate", csn.getCreateDate(),
                    "updateDate", csn.getUpdateDate(),
                    "id", csn.getConsignmentId()
            );
        }

        for (Consignment csn : consignmentRepos.saveAllAndFlush(preparedConsignments.values())) {
            preparedConsignments.put(csn.getConsignmentId(), csn);
        }

        transactionTemplate.execute(status -> jdbcTemplate.batchUpdate("UPDATE consignment SET create_date = :createDate, update_date = :updateDate WHERE consignment_id = :id", consignmentParams));

        ////////////////////////////////////////

        Map<String, Object>[] consignmentDetailsParams = new Map[preparedConsignmentDetails.size()];
        i = 0;
        for (Tuple p : preparedConsignmentDetails.values()) {
            consignmentDetailsParams[i++] = Map.of(
                    "createDate", p.getFirst().getCreateDate(),
                    "updateDate", p.getFirst().getUpdateDate(),
                    "id", p.getFirst().getConsignmentDetailId()
            );
        }

        for (ConsignmentDetail cd : consignmentDetailRepos.saveAllAndFlush(preparedConsignmentDetails.values().stream()
                .map(Tuple::getFirst).collect(Collectors.toList()))) {
            preparedConsignmentDetails.get(cd.getConsignmentDetailId()).setFirst(cd);
            for (Attachment a : preparedConsignmentDetails.get(cd.getConsignmentDetailId()).getSecond()) {
                a.setConsignmentDetail(cd);
            }
        }

        transactionTemplate.execute(status -> jdbcTemplate.batchUpdate("UPDATE consignment_detail SET create_date = :createDate, update_date = :updateDate WHERE consignment_detail_id = :id", consignmentDetailsParams));

        //////////////////////////////////
        List<Attachment> attachments = preparedConsignmentDetails.values().stream()
                .map(Tuple::getSecond).flatMap(Arrays::stream).toList();
        Map<String, Object>[] attachmentParams = new Map[attachments.size()];
        i = 0;
        for (Attachment a : attachments) {
            attachmentParams[i++] = Map.of(
                    "createDate", a.getCreateDate(),
                    "updateDate", a.getUpdateDate(),
                    "id", attachmentRepos.saveAndFlush(a).getAttachmentId()
            );
        }
        transactionTemplate.execute(status -> jdbcTemplate.batchUpdate("UPDATE attachment SET create_date = :createDate, update_date = :updateDate WHERE attachment_id = :id", attachmentParams));
    }

    private void generateItemCategory(JsonArray e) {
        if (itemCategoryRepos.count() > 0) {
            LOGGER.info(String.format("Skipped generating item categories: %d/%d exists", itemCategoryRepos.count(), e.size()));
            return;
        }
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
        if (itemRepos.count() > 0) {
            LOGGER.info(String.format("Skipped generating items: %d/%d exists", itemRepos.count(), e.size()));
            return;
        }
        LOGGER.info("Generate items...");
        for (JsonElement element : e) {
            JsonObject obj = element.getAsJsonObject();
            Item item = new Item();
            item.setItemId(obj.get("id").getAsInt());
            item.setItemCategory(itemCategoryRepos.getReferenceById(obj.get("categoryId").getAsInt()));
            item.setName(obj.get("name").getAsString());
            item.setDescription(obj.get("description").getAsString());
            item.setReservePrice(obj.get("reservePrice").getAsBigDecimal());
            item.setBuyInPrice(obj.get("buyInPrice").getAsBigDecimal());
            item.setStatus(Item.Status.valueOf(obj.get("status").getAsString()));
            item.setOwner(accountRepos.getReferenceById(obj.get("ownerId").getAsInt()));
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
        if (auctionSessionRepos.count() > 0) {
            LOGGER.info(String.format("Skipped generating auctions: %d/%d exists", auctionSessionRepos.count(), e.size()));
            return;
        }
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
                    auctionItem.setItem(itemRepos.getReferenceById(obj.get("itemId").getAsInt()));
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
        if (paymentRepos.count() > 0) {
            LOGGER.info(String.format("Skipped generating transactions: %d/%d exists", paymentRepos.count(), e.size()));
            return;
        }
        LOGGER.info("Generate transactions...");

        //Multimap<Integer, Integer> depositSet = HashMultimap.create();
        Map<Integer, Pair<Payment, Object>> preparedPayments = new HashMap<>();

        for (JsonElement element : e) {
            JsonObject obj = element.getAsJsonObject();
            Payment payment = new Payment();
            payment.setPaymentId(obj.get("id").getAsInt());
            payment.setPaymentAmount(obj.get("amount").getAsBigDecimal());
            payment.setStatus(Payment.Status.valueOf(obj.get("status").getAsString()));
            payment.setType(Payment.Type.valueOf(obj.get("type").getAsString()));
            payment.setAccount(accountRepos.getReferenceById(obj.get("accountId").getAsInt()));
            payment.setCreateDate(parseDate(obj.get("createDate").getAsString()));

//            if (payment.getType() == Payment.Type.AUCTION_DEPOSIT) {
//                JsonObject auctionItem = obj.getAsJsonObject("auctionItem");
//                int auctionId = auctionItem.get("auctionId").getAsInt();
//                if (depositSet.get(auctionId).contains(obj.get("accountId").getAsInt())) {
//                    continue;
//                }
//                depositSet.put(auctionId, obj.get("accountId").getAsInt());
//            }

            Object meta = null;

            switch (payment.getType()) {
                case AUCTION_BID -> {
                    JsonObject auctionItem = obj.getAsJsonObject("auctionItem");
                    Bid bid = new Bid();
                    bid.setAuctionItem(auctionItemRepos.getReferenceById(new AuctionItemId(
                                    auctionItem.get("auctionId").getAsInt(),
                                    auctionItem.get("itemId").getAsInt()
                            )
                    ));
                    meta = bid;
                }
                case AUCTION_DEPOSIT -> {
                    JsonObject auctionItem = obj.getAsJsonObject("auctionItem");
                    Deposit deposit = new Deposit();
                    deposit.setAuctionSession(auctionSessionRepos.getReferenceById(auctionItem.get("auctionId").getAsInt()));
                    meta = deposit;
                }
                case AUCTION_ORDER -> {
                    JsonObject auctionItem = obj.getAsJsonObject("auctionItem");
                    Order order = new Order();
                    order.setItems(Set.of(itemRepos.getReferenceById(auctionItem.get("itemId").getAsInt())));
                    meta = order;
                }
            }

            preparedPayments.put(payment.getPaymentId(), Pair.create(payment, meta));
        }

        /////////////////////////////

        Map<String, Object>[] paymentParams = new Map[preparedPayments.size()];
        int i = 0;
        for (Pair<Payment, Object> csn : preparedPayments.values()) {
            paymentParams[i++] = Map.of(
                    "createDate", csn.getFirst().getCreateDate(),
                    "id", csn.getFirst().getPaymentId()
            );
        }

        paymentRepos.saveAllAndFlush(preparedPayments.values()
                .stream().map(Pair::getFirst)
                .collect(Collectors.toList()));

        transactionTemplate.execute(status -> jdbcTemplate.batchUpdate("UPDATE payment SET create_date = :createDate WHERE payment_id = :id", paymentParams));

        /////////////////////////////

        List<Payment> paymentToSave = new ArrayList<>();

        for (Pair<Payment, Object> p : preparedPayments.values()) {
            Object o = p.getSecond();
            if (o instanceof Bid bid) {
                Payment payment = paymentRepos.findById(p.getFirst().getPaymentId()).orElseThrow();
                bid.setPayment(payment);
                payment.setBid(bid);
                paymentToSave.add(payment);
            }
            if (o instanceof Deposit deposit) {
                Payment payment = paymentRepos.findById(p.getFirst().getPaymentId()).orElseThrow();
                deposit.setPayment(payment);
                payment.setDeposit(deposit);
                paymentToSave.add(payment);
            }
            if (o instanceof Order order) {
                Payment payment = paymentRepos.findById(p.getFirst().getPaymentId()).orElseThrow();
                order.setPayment(payment);
                payment.setOrder(order);
                paymentToSave.add(payment);
            }
        }

        paymentRepos.saveAllAndFlush(paymentToSave);
    }

    private void generateNotification(JsonObject jsonObject) {
        if (notificationRepos.count() > 0) {
            LOGGER.info(String.format("Skipped generating notifications: %d/%d exists", notificationRepos.count(), jsonObject.getAsJsonArray("notification").size()));
            return;
        }
        LOGGER.info("Generate notifications...");
        String[] notificationList = jsonObject.getAsJsonArray("notification").asList()
                .stream().map(JsonElement::getAsString).toArray(String[]::new);
        JsonObject distribution = jsonObject.getAsJsonObject("distribution");
        List<Notification> notifications = new ArrayList<>();
        for (Map.Entry<String, JsonElement> e : distribution.entrySet()) {
            int accountId = Integer.parseInt(e.getKey());
            int[] where = e.getValue().getAsJsonArray().asList()
                    .stream().mapToInt(JsonElement::getAsInt).toArray();
            for (int i : where) {
                Notification notification = new Notification();
                notification.setMessage(notificationList[i]);
                notification.setAccount(accountRepos.getReferenceById(accountId));
                notifications.add(notification);
            }
        }
        notificationRepos.saveAllAndFlush(notifications);
    }

}
