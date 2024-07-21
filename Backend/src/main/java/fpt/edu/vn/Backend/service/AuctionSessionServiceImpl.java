package fpt.edu.vn.Backend.service;

import com.google.common.base.Preconditions;
import com.google.common.collect.Sets;
import fpt.edu.vn.Backend.DTO.*;
import fpt.edu.vn.Backend.DTO.request.ItemUpdateDTO;
import fpt.edu.vn.Backend.DTO.request.UpdateStatusAuctionSessionRequestDTO;
import fpt.edu.vn.Backend.exception.ConsignmentServiceException;
import fpt.edu.vn.Backend.exception.InvalidInputException;
import fpt.edu.vn.Backend.exception.ResourceNotFoundException;
import fpt.edu.vn.Backend.pojo.*;
import fpt.edu.vn.Backend.repository.*;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.core.io.ResourceLoader;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
//@CacheConfig(cacheNames = "auctionSession")
public class AuctionSessionServiceImpl implements AuctionSessionService {
    private final AuctionSessionRepos auctionSessionRepos;
    private static final Logger logger = LoggerFactory.getLogger(AuctionSessionServiceImpl.class);
    private final AccountRepos accountRepos;
    private final DepositRepos depositRepos;
    private final BidRepos bidRepos;
    private final PaymentRepos paymentRepos;
    private final ItemRepos itemRepos;
    private final AuctionItemRepos auctionItemRepos;
    private final OrderServiceImpl orderServiceImpl;

    @Autowired
    private ResourceLoader resourceLoader;


    @Autowired
    private AttachmentService attachmentService;

    private final NotificationService notificationService;
    private final JavaMailSender mailSender;
    private final ItemServiceImpl itemServiceImpl;
    @Value("${app.email}")
    private String systemEmail;

    private final Map<Integer, AuctionSession.Status> auctionHandlingLock = Collections.synchronizedMap(new HashMap<>());
    @Autowired
    private OrderDetailRepos orderDetailRepos;

    @Autowired
    public AuctionSessionServiceImpl(AuctionSessionRepos auctionSessionRepos, AccountRepos accountRepos,
                                     DepositRepos depositRepos, NotificationService notificationService,
                                     BidRepos bidRepos, PaymentRepos paymentRepos, ItemRepos itemRepos,
                                     AuctionItemRepos auctionItemRepos, OrderServiceImpl orderServiceImpl,
                                     JavaMailSender mailSender, ItemServiceImpl itemServiceImpl) {
        this.auctionSessionRepos = auctionSessionRepos;
        this.accountRepos = accountRepos;
        this.depositRepos = depositRepos;
        this.notificationService = notificationService;
        this.bidRepos = bidRepos;
        this.paymentRepos = paymentRepos;
        this.itemRepos = itemRepos;
        this.auctionItemRepos = auctionItemRepos;
        this.orderServiceImpl = orderServiceImpl;
        this.mailSender = mailSender;
        this.itemServiceImpl = itemServiceImpl;
    }

    public AuctionSessionDTO mapAuctionSessionToDTO(AuctionSession pojo, @Nullable Integer accountId) {
        AuctionSessionDTO dto = new AuctionSessionDTO();
        dto.setAuctionSessionId(pojo.getAuctionSessionId());
        dto.setStartDate(pojo.getStartDate());
        dto.setEndDate(pojo.getEndDate());
        dto.setStatus(pojo.getStatus());
        dto.setCreateDate(pojo.getCreateDate());
        dto.setUpdateDate(pojo.getUpdateDate());
        dto.setTitle(pojo.getTitle());
        dto.setDescription(pojo.getDescription());
        dto.setAttachments(pojo.getAttachments() != null ? pojo.getAttachments().stream().map(AttachmentDTO::new).collect(Collectors.toSet()) : new HashSet<>());
        dto.setAuctionItems(pojo.getAuctionItems() != null ? pojo.getAuctionItems().stream().map(AuctionItemDTO::new).collect(Collectors.toSet()) : new HashSet<>());
        dto.setParticipantCount(pojo.getParticipantCount());
        if (accountId != null)
            dto.setHasDeposited(depositRepos.hasDeposited(pojo.getAuctionSessionId(), accountId));
        return dto;
    }

    @Override
    //@CacheEvict(key = "#auctionSessionId",cacheNames = "auctionSession",value = "auctionSession", allEntries = true, beforeInvocation = true)
    public AuctionSessionDTO registerAuctionSession(int auctionSessionId, int accountId) {
        Account a = accountRepos.findById(accountId).orElseThrow(
                () -> new ResourceNotFoundException("Account not found:" + accountId));
        AuctionSession auctionSession = auctionSessionRepos.findById(auctionSessionId).orElseThrow(
                () -> new ResourceNotFoundException("Auction session not found:" + auctionSessionId));
//        Preconditions.checkState(
//                LocalDateTime.now().isAfter(auctionSession.getStartDate()),
//                "Auction session has not yet started");
        Preconditions.checkState(
                auctionSession.getStatus() != AuctionSession.Status.FINISHED &&
                        auctionSession.getStatus() != AuctionSession.Status.TERMINATED,
                "Auction session has been ended");
        Preconditions.checkState(
                LocalDateTime.now().isBefore(auctionSession.getEndDate()),
                "Auction session has been ended");

        List<Item> items = new ArrayList<>();
        for (AuctionItem auctionItem : auctionSession.getAuctionItems()) {
            items.add(auctionItem.getItem());
        }
        if (items.isEmpty()) {
            throw new ResourceNotFoundException("No items found in auction session");
        }
        items.sort(Comparator.comparing(Item::getReservePrice));
        BigDecimal minPrice = new BigDecimal(100);
        BigDecimal maxPrice = new BigDecimal(1000);
        BigDecimal depositAmount = items.get(0).getReservePrice()
                .multiply(BigDecimal.valueOf(4.5 / 100d));
        depositAmount = depositAmount.max(minPrice);
        depositAmount = depositAmount.min(maxPrice);

        if (a.getBalance().compareTo(depositAmount) >= 0) {
            Preconditions.checkState(!depositRepos.hasDeposited(auctionSessionId, accountId), "Already deposited");
            a.setBalance(a.getBalance().subtract(depositAmount));
            accountRepos.save(a);

            Payment payment = new Payment();
            payment.setAccount(a);
            payment.setPaymentAmount(depositAmount);
            payment.setType(Payment.Type.AUCTION_DEPOSIT);
            payment.setStatus(Payment.Status.PENDING);
            payment.setCreateDate(LocalDateTime.now());
            payment = paymentRepos.save(payment);

            Deposit deposit = new Deposit();
            deposit.setAuctionSession(auctionSession);
            deposit.setPayment(payment);
            deposit = depositRepos.save(deposit);

            auctionSession.getDeposits().add(deposit);
            auctionSession = auctionSessionRepos.save(auctionSession);

            return mapAuctionSessionToDTO(auctionSession, accountId);
        } else {
            throw new ResourceNotFoundException("Account balance is not enough to register for auction session");
        }
    }

    @Override
    //@CacheEvict(cacheNames = "auctionSession",value = "auctionSession", allEntries = true, beforeInvocation = true)
//    @Caching(evict = {
//            //@CacheEvict(cacheNames = "auctionSession", allEntries = true),
//            //@CacheEvict(cacheNames = "item", allEntries = true),
//            // Add more //@CacheEvict annotations as needed
//    })
    public boolean assignAuctionSession(AssignAuctionItemDTO assign) {
        try {
            AuctionSession auctionSession = auctionSessionRepos.findById(assign.getAuctionSessionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Auction Session not found: " + assign.getAuctionSessionId()));
            if (auctionSession.getStatus() != AuctionSession.Status.SCHEDULED) {
                logger.info("Auction session {} not in SCHEDULED state", assign.getAuctionSessionId());
                throw new InvalidInputException("Auction session not in SCHEDULED state ");
            }

            for (Integer itemIds : assign.getItem()) {
                Item item = itemRepos.findById(itemIds)
                        .orElseThrow(() -> new ResourceNotFoundException("Item not found: " + itemIds));
                if (item.getStatus() != Item.Status.QUEUE) {
                    logger.info("Item {} is not in queue or unsold", item.getItemId());
                    throw new InvalidInputException("Item is not in queue or unsold: " + item.getItemId());
                }

                AuctionItem auctionItem = new AuctionItem();
                auctionItem.setAuctionItemId(new AuctionItemId(auctionSession.getAuctionSessionId(), item.getItemId()));
                auctionItem.setAuctionSession(auctionSession);
                auctionItem.setItem(item);
                auctionItem.setCurrentPrice(item.getReservePrice()); // Buy in price
                auctionItemRepos.save(auctionItem);

                item.setStatus(Item.Status.IN_AUCTION);
                itemRepos.save(item);
            }

            for (Account a : accountRepos.findByRole(Account.Role.MEMBER)) {
                if (!a.isDummy()) { // skip email for dummy accounts
                    MimeMessage message = mailSender.createMimeMessage();
                    MimeMessageHelper helper = new MimeMessageHelper(message, false);
                    helper.setFrom(systemEmail);
                    helper.setTo(a.getEmail());
                    helper.setSubject("[Biddify] New Jewelry auction");
                    // Read the HTML file into a String
                    InputStream inputStream = resourceLoader.getResource("classpath:templates/auctionNotiMail.html").getInputStream();
                    String htmlContent = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
                    // Replace placeholders in the HTML content with actual values
                    htmlContent = htmlContent.replace("{auctionName}", auctionSession.getTitle());
                    htmlContent = htmlContent.replace("{auctionId}", String.valueOf(auctionSession.getAuctionSessionId()));
                    htmlContent = htmlContent.replace("{createDate}", String.valueOf(auctionSession.getCreateDate()));
                    htmlContent = htmlContent.replace("{auctionImage}", String.valueOf(auctionSession.getAttachments().size() == 0 ? "" : auctionSession.getAttachments().get(0).getLink()));
                    helper.setText(htmlContent, true);
                    mailSender.send(message);
                }
            }

            return true;
        } catch (Exception e) {
            logger.error("Error assigning auction session", e);
            throw new InvalidInputException(e.getMessage());
        }
    }

    //@CacheEvict(key = "#auctionDTO.getAuctionSessionId()",cacheNames = "auctionSession",value = "auctionSession", allEntries = true, beforeInvocation = true)
    @Override
    public AuctionSessionDTO createAuctionSession(AuctionCreateDTO auctionDTO) {
        if (auctionDTO.getStartDate().isBefore(LocalDateTime.now())) {
            throw new InvalidInputException("Start date must be in the future");
        }
        if (auctionDTO.getEndDate().isBefore(auctionDTO.getStartDate())) {
            throw new InvalidInputException("End date must be after start date");
        }
        AuctionSession conflictingSession = auctionSessionRepos.getConflictingSession(
                auctionDTO.getStartDate(), auctionDTO.getEndDate());
        if (conflictingSession != null) {
            throw new InvalidInputException(String.format(
                    "There is an already scheduled auction session %d between %s and %s",
                    conflictingSession.getAuctionSessionId(),
                    conflictingSession.getStartDate(),
                    conflictingSession.getEndDate()
            ));
        }
        try {
            AuctionSession auctionSession = new AuctionSession();
            auctionSession.setTitle(auctionDTO.getTitle());
            auctionSession.setStartDate(auctionDTO.getStartDate());
            auctionSession.setEndDate(auctionDTO.getEndDate());
            auctionSession.setCreateDate(LocalDateTime.now());
            auctionSession.setUpdateDate(LocalDateTime.now());
            auctionSession.setStatus(AuctionSession.Status.SCHEDULED);
            AuctionSession savedAuctionSession = auctionSessionRepos.save(auctionSession);
            try {
                if (auctionDTO.getFiles() != null && !auctionDTO.getFiles().isEmpty()) {
                    for (MultipartFile file : auctionDTO.getFiles()) {
                        attachmentService.uploadAuctionAttachment(file, savedAuctionSession.getAuctionSessionId());
                    }
                }
            } catch (Exception e) {
                throw new InvalidInputException("Error uploading attachments", e);
            }
            return mapAuctionSessionToDTO(savedAuctionSession, null);
        } catch (Exception e) {
            throw new InvalidInputException("Error creating auction session", e);
        }
    }

    @Override
    //@CacheEvict(cacheNames = "auctionSession",value = "auctionSession", allEntries = true, beforeInvocation = true)
    public void finishAuction(int auctionSessionId) {
        AuctionSession auction = auctionSessionRepos.findById(auctionSessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid auction session id: " + auctionSessionId));
        if (auction.getStatus() == AuctionSession.Status.FINISHED ||
                auction.getStatus() == AuctionSession.Status.TERMINATED) {
            logger.warn("Auction session " + auctionSessionId + " already ended");
            return;
        }
        if (auction.getStatus() == AuctionSession.Status.SCHEDULED) {
            if (auction.getEndDate().isBefore(LocalDateTime.now())) {
                terminateAuction(auctionSessionId);
                return;
            }
            logger.warn("Auction session " + auctionSessionId + " not started yet");
            return;
        }
        if (auctionHandlingLock.putIfAbsent(auctionSessionId, AuctionSession.Status.FINISHED) != null) {
            logger.info("Auction session {} is already in progress of {}",
                    auctionSessionId, auctionHandlingLock.get(auctionSessionId));
            return;
        }
        logger.info("Finishing auction session " + auctionSessionId);

        //////////////

        record Participant(Account account, List<AuctionItem> wonItems, List<AuctionItem> lostItems) {
            Participant(Account account) {
                this(account, new ArrayList<>(), new ArrayList<>());
            }
        }

        Map<Integer, Participant> participants = new HashMap<>();
        List<NotificationDTO> scheduledNotifications = new ArrayList<>();
        int bidCount = 0;

        //////////////
        logger.info("Handle bids and items for auction {} ", auctionSessionId);

        for (AuctionItem auctionItem : auction.getAuctionItems()) {
            List<Bid> bids = bidRepos.findAllBidByAuctionItem_AuctionItemIdOrderByAmountDesc(auctionItem.getAuctionItemId());
            bidCount += bids.size();

            Item item = auctionItem.getItem();
            item.setStatus(bids.isEmpty() ? Item.Status.QUEUE : Item.Status.SOLD);
            itemRepos.save(item);

            for (int i = 0; i < bids.size(); i++) {
                Bid bid = bids.get(i);
                bid.setStatus(i == 0 ? Bid.Status.SUCCESS : Bid.Status.FAILED);
            }
            bidRepos.saveAll(bids);

            if (!bids.isEmpty() && bids.get(0).getAmount().compareTo(item.getReservePrice()) >= 0) {
                Account winner = bids.get(0).getAccount();
                participants.computeIfAbsent(winner.getAccountId(), (v) -> new Participant(winner))
                        .wonItems.add(auctionItem);

                Set<Integer> seenAccounts = new HashSet<>();
                for (Account loser : bids.stream()
                        .map(Bid::getAccount)
                        .filter(a -> winner.getAccountId() != a.getAccountId())
                        .filter(a -> seenAccounts.add(a.getAccountId()))
                        .toList()) {
                    participants.computeIfAbsent(loser.getAccountId(), (v) -> new Participant(loser))
                            .lostItems.add(auctionItem);
                }
                logger.info("Item {} has {} bids, winner is {} and {} losers",
                        auctionItem.getAuctionItemId(), bids.size(),
                        winner.getAccountId(), seenAccounts.size());
            } else {
                logger.info("Item {} has {} bids without winner", auctionItem.getAuctionItemId(), bids.size());
            }
        }

        //////////////
        logger.info("Handle notification and order for auction {} ", auctionSessionId);

        for (Participant participant : participants.values()) {
            Account account = participant.account;
            if (!participant.wonItems.isEmpty())
                logger.info("User {} won items {}", account.getAccountId(), participant.wonItems.stream()
                        .map(AuctionItem::getAuctionItemId)
                        .map(AuctionItemId::toString)
                        .collect(Collectors.joining(", ")));
            if (!participant.lostItems.isEmpty())
                logger.info("User {} lost items {}", account.getAccountId(), participant.lostItems.stream()
                        .map(AuctionItem::getAuctionItemId)
                        .map(AuctionItemId::toString)
                        .collect(Collectors.joining(", ")));

            for (AuctionItem wonItem : participant.wonItems) {
                scheduledNotifications.add(NotificationDTO.builder()
                        .message(String.format(
                                "Congratulations! You have won %s from auction %s",
                                wonItem.getItem().getName(),
                                auction.getTitle()
                        ))
                        .userId(account.getAccountId())
                        .build());
            }

            for (AuctionItem lostItem : participant.lostItems) {
                scheduledNotifications.add(NotificationDTO.builder()
                        .message(String.format(
                                "Oops! You have lost %s from auction %s",
                                lostItem.getItem().getName(),
                                auction.getTitle()
                        ))
                        .userId(account.getAccountId())
                        .build());
            }

            CompletableFuture.runAsync(() -> {
                if (account.isDummy()) return; // skip email for dummy accounts
                try {
                    sendMail(
                            account.getEmail(),
                            "[Biddify] Congratulations! You have won an auction",
                            """
                                           <p>You have won following items from auction %s:</p>
                                           <ul>%s</ul>
                                    """.formatted(
                                    auction.getTitle(),
                                    participant.wonItems.stream()
                                            .map((a) -> "<li>" + a.getItem().getName() + "</li>")
                                            .collect(Collectors.joining("\n"))
                            )
                    );
                } catch (MessagingException e) {
                    logger.info("Error sending mail to " + account.getEmail(), e);
                }
            });

            if (!participant.wonItems.isEmpty()) {
                logger.info("Creating order for winner {} ", participant.account.getAccountId());
                orderServiceImpl.createOrder(
                        account.getAccountId(),
                        participant.wonItems.stream()
                                .map(AuctionItem::getAuctionItemId)
                                .collect(Collectors.toUnmodifiableSet()),
                        auctionSessionId
                );
            }

            scheduledNotifications.add(
                    NotificationDTO.builder()
                            .message(String.format(
                                    "Auction %s has finished with %d participants, %d items and %d bids",
                                    auction.getTitle(),
                                    participants.size(),
                                    auction.getAuctionItems().size(),
                                    bidCount
                            ))
                            .userId(account.getAccountId())
                            .build()
            );
        }

        logger.info("Handle deposits for auction {} ", auctionSessionId);

        for (Deposit deposit : auction.getDeposits()) {
            Payment p = deposit.getPayment();
            if (p.getStatus() != Payment.Status.PENDING)
                continue;
            Account account = p.getAccount();
            account.setBalance(account.getBalance().add(p.getPaymentAmount()));
            accountRepos.save(account);
            scheduledNotifications.add(
                    NotificationDTO.builder()
                            .message(String.format(
                                    "Your deposit has been refunded from auction %s",
                                    auction.getTitle()
                            ))
                            .userId(account.getAccountId())
                            .build()
            );
            p.setStatus(Payment.Status.SUCCESS);
            paymentRepos.save(p);
            logger.info("Refunded deposit id {} for account {}", deposit.getDepositId(), account.getAccountId());
        }

        auction.setStatus(AuctionSession.Status.FINISHED);
        auctionSessionRepos.save(auction);
        notificationService.sendBulkNotification(scheduledNotifications);
        logger.info("Auction session " + auctionSessionId + " finished");
        auctionHandlingLock.remove(auctionSessionId);
    }

    //@CacheEvict(cacheNames = "auctionSession",value = "auctionSession", allEntries = true, beforeInvocation = true)
    @Override
    public void terminateAuction(int auctionSessionId) {
        AuctionSession auction = auctionSessionRepos.findById(auctionSessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid auction session id: " + auctionSessionId));
        if (auction.getStatus() == AuctionSession.Status.FINISHED ||
                auction.getStatus() == AuctionSession.Status.TERMINATED) {
            logger.warn("Auction session " + auctionSessionId + " already ended");
            return;
        }
        if (auctionHandlingLock.putIfAbsent(auctionSessionId, AuctionSession.Status.TERMINATED) != null) {
            logger.info("Auction session {} is already in progress of {}",
                    auctionSessionId, auctionHandlingLock.get(auctionSessionId));
            return;
        }

        logger.info("Terminating auction session " + auctionSessionId);
        List<NotificationDTO> scheduledNotifications = new ArrayList<>();

        logger.info("Handle bids and items for auction {} ", auctionSessionId);

        for (AuctionItem auctionItem : auction.getAuctionItems()) {
            Set<Bid> bids = auctionItem.getBids();
            for (Bid bid : bids) {
                bid.setStatus(Bid.Status.FAILED);
            }
            bidRepos.saveAll(bids);

            Item item = auctionItem.getItem();
            item.setStatus(Item.Status.QUEUE);
            itemRepos.save(item);

            logger.info("Item {} has {} bids without winner", auctionItem.getAuctionItemId(), bids.size());
        }

        logger.info("Handle deposits for auction {} ", auctionSessionId);

        for (Deposit deposit : auction.getDeposits()) {
            Payment p = deposit.getPayment();
            scheduledNotifications.add(
                    NotificationDTO.builder()
                            .message(String.format(
                                    "Auction %s has been terminated",
                                    auction.getTitle()
                            ))
                            .userId(p.getAccount().getAccountId())
                            .build()
            );
            final Account finalAccount = p.getAccount();
            CompletableFuture.runAsync(() -> {
                if (finalAccount.isDummy()) return; // skip email for dummy accounts
                try {
                    sendMail(
                            finalAccount.getEmail(),
                            "[Biddify] Auction has been terminated",
                            """
                                           <p>Due to unexpected circumstances, we have to terminate auction %s</p>
                                           <p>Your deposit will be refunded to your wallet</p>
                                           <p>Stay stunned for upcoming updates.</p>
                                    """.formatted(auction.getTitle())
                    );
                } catch (MessagingException e) {
                    logger.info("Error sending mail to " + finalAccount.getEmail(), e);
                }
            });

            if (p.getStatus() != Payment.Status.PENDING)
                continue;
            p.setStatus(Payment.Status.FAILED);
            p.setFailedReason("Auction has been terminated");
            p = paymentRepos.save(p);

            Account account = p.getAccount();
            account.setBalance(account.getBalance().add(p.getPaymentAmount()));
            accountRepos.save(account);

            scheduledNotifications.add(
                    NotificationDTO.builder()
                            .message(String.format(
                                    "Your deposit has been refunded from auction %s",
                                    auction.getTitle()
                            ))
                            .userId(account.getAccountId())
                            .build()
            );
            logger.info("Refunded deposit id {} for account {} ", p.getPaymentId(), account.getAccountId());
        }

        auction.setStatus(AuctionSession.Status.TERMINATED);
        auctionSessionRepos.save(auction);
        notificationService.sendBulkNotification(scheduledNotifications);
        logger.info("Auction session " + auctionSessionId + " terminated");
        auctionHandlingLock.remove(auctionSessionId);
    }

    @Override
    //@CacheEvict(cacheNames = "auctionSession",value = "auctionSession", allEntries = true, beforeInvocation = true)
    public void startAuction(int auctionSessionId) {
        AuctionSession auction = auctionSessionRepos.findById(auctionSessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid auction session id: " + auctionSessionId));
        if (auction.getStatus() == AuctionSession.Status.FINISHED ||
                auction.getStatus() == AuctionSession.Status.TERMINATED) {
            logger.warn("Auction session " + auctionSessionId + " already ended");
            return;
        }
        if (auction.getStatus() == AuctionSession.Status.PROGRESSING) {
            logger.warn("Auction session " + auctionSessionId + " already started");
            return;
        }
        if (auctionHandlingLock.putIfAbsent(auctionSessionId, AuctionSession.Status.PROGRESSING) != null) {
            logger.info("Auction session {} is already in progress of {}",
                    auctionSessionId, auctionHandlingLock.get(auctionSessionId));
            return;
        }
        logger.info("Starting auction session " + auctionSessionId);

        List<NotificationDTO> scheduledNotifications = new ArrayList<>();
        for (Deposit deposit : auction.getDeposits()) {
            scheduledNotifications.add(
                    NotificationDTO.builder()
                            .message(String.format(
                                    "Auction %s has started. Let's bid!",
                                    auction.getTitle()
                            ))
                            .userId(deposit.getPayment().getAccount().getAccountId())
                            .build()
            );
        }
        auction.setStatus(AuctionSession.Status.PROGRESSING);
        auctionSessionRepos.save(auction);
        notificationService.sendBulkNotification(scheduledNotifications);
        logger.info("Auction session " + auctionSessionId + " started");
        auctionHandlingLock.remove(auctionSessionId);
    }

    @Override
    public Page<AuctionSessionDTO> getFeaturedAuctionSessions(Pageable pageable, @Nullable Integer accountId) {
        if (pageable == null) {
            pageable = PageRequest.of(0, 5);
        }
        return auctionSessionRepos.findByCriteriaHasParticipant(
                Set.of(AuctionSession.Status.SCHEDULED), null, LocalDateTime.now(),
                null, pageable).map(a -> mapAuctionSessionToDTO(a, accountId));
    }

    @Override
    public Page<AuctionSessionDTO> getPastAuctionOfItem(Pageable pageable, int itemId) {
        return auctionSessionRepos.findAuctionSessionsHasItem(itemId, pageable).map(AuctionSessionDTO::minimal);
    }

    @Override
    //@CacheEvict(key = "#auctionDTO.getAuctionSessionId()", cacheNames = "auctionSession",value = "auctionSession",allEntries = true)
    public AuctionSessionDTO updateAuctionSession(AuctionSessionDTO auctionDTO) {
        if (auctionDTO.getStartDate().isBefore(LocalDateTime.now())) {
            throw new InvalidInputException("Start date must be in the future");
        }
        if (auctionDTO.getEndDate().isBefore(auctionDTO.getStartDate())) {
            throw new InvalidInputException("End date must be after start date");
        }
        if (auctionDTO.getStatus() == AuctionSession.Status.FINISHED ||
                auctionDTO.getStatus() == AuctionSession.Status.TERMINATED) {
            throw new InvalidInputException("Auction session already ended");
        }
        if (auctionDTO.getStatus() == AuctionSession.Status.PROGRESSING) {
            throw new InvalidInputException("Auction session already started");
        }
        try {
            AuctionSession auctionSession = auctionSessionRepos.findById(auctionDTO.getAuctionSessionId()).
                    orElseThrow(() -> new ResourceNotFoundException("Auction session not found", "id", auctionDTO.getAuctionSessionId()));
            auctionSession.setStartDate(auctionDTO.getStartDate());
            auctionSession.setEndDate(auctionDTO.getEndDate());
            auctionSession.setUpdateDate(LocalDateTime.now());
            // use terminate or finish button, thanks :D
            //auctionSession.setStatus(AuctionSession.Status.valueOf(auctionDTO.getStatus()));
            auctionSessionRepos.save(auctionSession);
            return auctionDTO;
        } catch (Exception e) {
            throw new ResourceNotFoundException("Error updating auction session", e);
        }
    }

    //@Cacheable(key = "#id", value = "auctionSession")
    @Override
    public AuctionSessionDTO getAuctionSessionById(int id, @Nullable Integer accountId) {
        try {
            AuctionSession auctionSession = auctionSessionRepos.findById(id).orElseThrow(() ->
                    new ResourceNotFoundException("Auction Session Id Not Found"));
            return mapAuctionSessionToDTO(auctionSession, accountId);
        } catch (Exception e) {
            logger.error("Error processing auction session id: " + id, e);
            throw new ResourceNotFoundException("Error processing auction session", e);
        }
    }

    @Override
    public Page<AuctionSessionDTO> getAuctionSessions(Pageable pageable,
                                                      @Nullable Set<AuctionSession.Status> status,
                                                      @Nullable String search,
                                                      @Nullable LocalDateTime fromDate,
                                                      @Nullable LocalDateTime toDate,
                                                      @Nullable Integer accountId) {
        return auctionSessionRepos.findByCriteria(status, search, fromDate, toDate, pageable)
                .map(a -> mapAuctionSessionToDTO(a, accountId));

    }

    private void sendMail(String targetEmail, String title, String content) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, false);
        helper.setFrom(systemEmail);
        helper.setTo(targetEmail);
        helper.setSubject(title);
        helper.setText(content, true);
        mailSender.send(message);
    }

}
