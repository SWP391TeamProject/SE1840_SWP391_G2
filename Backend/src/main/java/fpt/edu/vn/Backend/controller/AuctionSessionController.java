package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.DTO.AssignAuctionItemDTO;
import fpt.edu.vn.Backend.DTO.AuctionCreateDTO;
import fpt.edu.vn.Backend.DTO.AuctionSessionDTO;
import fpt.edu.vn.Backend.DTO.request.UpdateStatusAuctionSessionRequestDTO;
import fpt.edu.vn.Backend.pojo.AuctionSession;
import fpt.edu.vn.Backend.security.Authorizer;
import fpt.edu.vn.Backend.service.AccountService;
import fpt.edu.vn.Backend.service.AttachmentService;
import fpt.edu.vn.Backend.service.AuctionSessionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/auction-sessions")
public class AuctionSessionController {
    private static final Logger log = LoggerFactory.getLogger(AuctionSessionController.class);
    @Autowired
    private AuctionSessionService auctionSessionService;
    @Autowired
    private AccountService accountService;

    @GetMapping(value = "/", produces = "application/json")
    public ResponseEntity<Page<AuctionSessionDTO>> getAllAuctionSessions(
            Principal principal,
            @PageableDefault(size = 50) Pageable pageable) {
        return ResponseEntity.ok(auctionSessionService.getAuctionSessions(
                pageable, null, null, null, null,
                Authorizer.getUserId(principal)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuctionSessionDTO> getAuctionSessionById(
            Principal principal,
            @PathVariable int id) {
        return new ResponseEntity<>(
                auctionSessionService.getAuctionSessionById(id, Authorizer.getUserId(principal)),
                HttpStatus.OK);
    }

    @GetMapping("/search/{title}")
    public ResponseEntity<Page<AuctionSessionDTO>> searchAuction(
            Principal principal,
            @PageableDefault(size = 200) Pageable pageable,
            @PathVariable String title) {
        return ResponseEntity.ok(auctionSessionService.getAuctionSessions(
                pageable, null, title, null, null,
                Authorizer.getUserId(principal)));
    }

    @GetMapping("/history-item/{itemId}")
    public ResponseEntity<Page<AuctionSessionDTO>> getPastAuctionOfItem(@PageableDefault(size = 200) Pageable pageable,
                                                                        @PathVariable int itemId) {
        return new ResponseEntity<>(auctionSessionService.getPastAuctionOfItem(pageable, itemId), HttpStatus.OK);
    }

    @GetMapping("/active")
    public ResponseEntity<Page<AuctionSessionDTO>> getActiveAuctionSession(
            Principal principal,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(auctionSessionService.getAuctionSessions(
                pageable,
                Set.of(AuctionSession.Status.PROGRESSING, AuctionSession.Status.SCHEDULED),
                null, null, null,
                Authorizer.getUserId(principal)));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<Page<AuctionSessionDTO>> getUpcomingAuctionSession(
            Principal principal,
            @RequestParam(defaultValue = "0") int pageNumb,
            @RequestParam(defaultValue = "50") int pageSize) {
        Pageable pageable = PageRequest.of(pageNumb, pageSize);
        return ResponseEntity.ok(auctionSessionService.getAuctionSessions(
                pageable,
                Set.of(AuctionSession.Status.SCHEDULED),
                null, null, null,
                Authorizer.getUserId(principal)));
    }

    @GetMapping("/completed")
    public ResponseEntity<Page<AuctionSessionDTO>> getCompletedAuctionSession(
            Principal principal,
            @RequestParam(defaultValue = "0") int pageNumb,
            @RequestParam(defaultValue = "50") int pageSize) {
        Pageable pageable = PageRequest.of(pageNumb, pageSize);
        return ResponseEntity.ok(auctionSessionService.getAuctionSessions(
                pageable,
                Set.of(AuctionSession.Status.FINISHED, AuctionSession.Status.TERMINATED),
                null, null, null,
                Authorizer.getUserId(principal)));
    }

    @GetMapping("/featured")
    public ResponseEntity<Page<AuctionSessionDTO>> getFeaturedAuctionSession(
            Principal principal,
            @RequestParam(required = false)
            @PageableDefault(size = 50) Pageable pageable
    ) {
        return new ResponseEntity<>(
                auctionSessionService.getFeaturedAuctionSessions(pageable, Authorizer.getUserId(principal)),
                HttpStatus.OK);
    }

    @PostMapping("/")
    public ResponseEntity<AuctionSessionDTO> createAuctionSession(@ModelAttribute AuctionCreateDTO auctionDTO) {
        AuctionSessionDTO auctionSessionDTO = auctionSessionService.createAuctionSession(auctionDTO);
        return new ResponseEntity<>(auctionSessionDTO, HttpStatus.OK);
    }

    @PostMapping("/assign-auction-session")
    public ResponseEntity<AssignAuctionItemDTO> assignAuctionItem(@RequestBody AssignAuctionItemDTO assignAuctionItemDTO) {
        if (!auctionSessionService.assignAuctionSession(assignAuctionItemDTO)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AuctionSessionDTO> updateAuctionSession(@RequestBody AuctionSessionDTO auctionDTO) {
        return new ResponseEntity<>(auctionSessionService.updateAuctionSession(auctionDTO), HttpStatus.OK);
    }

    @GetMapping("/register/{id}")
    public ResponseEntity<AuctionSessionDTO> registerAuctionSession(
            Principal principal, @PathVariable int id) {
        return new ResponseEntity<>(
                auctionSessionService.registerAuctionSession(id, Authorizer.requireUser(principal).getUserId()),
                HttpStatus.OK);
    }

    @GetMapping("/finish/{id}")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<String> finishAuctionSession(@PathVariable int id) {
        auctionSessionService.finishAuction(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/terminate/{id}")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<String> terminateAuctionSession(@PathVariable int id) {
        auctionSessionService.terminateAuction(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
