package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.AccountDTO;
import fpt.edu.vn.Backend.DTO.AuctionCreateDTO;
import fpt.edu.vn.Backend.DTO.AuctionSessionDTO;
import fpt.edu.vn.Backend.service.AccountService;
import fpt.edu.vn.Backend.service.AttachmentService;
import fpt.edu.vn.Backend.service.AuctionSessionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/auction-sessions")
public class AuctionSessionController {
    private static final Logger log = LoggerFactory.getLogger(AuctionSessionController.class);
    @Autowired
    private AuctionSessionService auctionSessionService;
    @Autowired
    private AttachmentService attachmentService;
    @Autowired
    private AccountService accountService;
    @GetMapping(value = "/", produces = "application/json")
    public ResponseEntity<Page<AuctionSessionDTO>> getAllAuctionSessions(@RequestParam(defaultValue = "0") int pageNumb,@RequestParam(defaultValue = "50") int pageSize) {
        Pageable pageable = PageRequest.of(pageNumb,pageSize);
        return new ResponseEntity<>(auctionSessionService.getAllAuctionSessions(pageable), HttpStatus.OK);
    }


    @GetMapping("/{id}")
    public ResponseEntity<AuctionSessionDTO> getAuctionSessionById(@PathVariable int id) {
        return new ResponseEntity<>(auctionSessionService.getAuctionSessionById(id), HttpStatus.OK);
    }


    @GetMapping("/active")
    public ResponseEntity<Page<AuctionSessionDTO>> getActiveAuctionSession() {
        return null;
    }

    @GetMapping("/inactive")
    public ResponseEntity<Page<AuctionSessionDTO>> getInactiveAuctionSession() {
        return null;
    }

    @GetMapping("/upcoming")
    public ResponseEntity<Page<AuctionSessionDTO>> getUpcomingAuctionSession(@RequestParam(defaultValue = "0") int pageNumb, @RequestParam(defaultValue = "50") int pageSize) {
        Pageable pageable = PageRequest.of(pageNumb,pageSize);
        return new ResponseEntity<>(auctionSessionService.getUpcomingAuctionSessions(pageable), HttpStatus.OK);
    }
    @GetMapping("/past")
    public ResponseEntity<Page<AuctionSessionDTO>> getPastAuctionSession() {
        return null;
    }


    @GetMapping("/completed")
    public ResponseEntity<Page<AuctionSessionDTO>> getCompletedAuctionSession(@RequestParam(defaultValue = "0") int pageNumb, @RequestParam(defaultValue = "50") int pageSize) {

        Pageable pageable = PageRequest.of(pageNumb,pageSize);
        return new ResponseEntity<>(auctionSessionService.getPastAuctionSessions(pageable), HttpStatus.OK);
    }

    @GetMapping("/current")
    public ResponseEntity<AuctionSessionDTO> getCurrentAuctionSession() {
        return null;
    }

    @PostMapping("/")
    public ResponseEntity<AuctionSessionDTO> createAuctionSession(@RequestBody AuctionCreateDTO auctionDTO) {
        AuctionSessionDTO auctionSessionDTO = new AuctionSessionDTO();
        auctionSessionDTO.setTitle(auctionDTO.getTitle());
        auctionSessionDTO.setStartDate(auctionDTO.getStartDate());
        auctionSessionDTO.setEndDate(auctionDTO.getEndDate());
        auctionSessionDTO.setStatus("SCHEDULED");
        auctionSessionDTO.setCreateDate(LocalDateTime.now());
        auctionSessionDTO.setUpdateDate(LocalDateTime.now());
        auctionSessionDTO=auctionSessionService.createAuctionSession(auctionSessionDTO);
        if(auctionDTO.getFiles()!=null){
            try {
                for (MultipartFile file : auctionDTO.getFiles()) {
                    attachmentService.uploadAuctionAttachment(file,auctionSessionDTO.getAuctionSessionId());
                }
            } catch (Exception e) {
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<>(auctionSessionService.getAuctionSessionById(auctionSessionDTO.getAuctionSessionId()), HttpStatus.OK);
    }




    @PutMapping("/{id}")
    public ResponseEntity<AuctionSessionDTO> updateAuctionSession(@RequestBody AuctionSessionDTO auctionDTO) {
        return new ResponseEntity<>(auctionSessionService.updateAuctionSession(auctionDTO), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAuctionSession( @PathVariable String id) {
        return null;
    }

    @GetMapping("/register/{id}")
    public ResponseEntity<AuctionSessionDTO> registerAuctionSession(@PathVariable int id, Authentication authentication) {

        AccountDTO a = accountService.getAccountByEmail(authentication.getName());
        if (a == null) {
            log.error("Account not found");
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if(auctionSessionService.getAuctionSessionById(id).getEndDate().isBefore(LocalDateTime.now())){
            log.error("Auction session has ended");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if(auctionSessionService.getAuctionSessionById(id).getStatus().equals("TERMINATED")){
            log.error("Auction session has been terminated");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if(auctionSessionService.getAuctionSessionById(id).getStatus().equals("FINISHED")){
            log.error("Auction session has finished");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if(auctionSessionService.getAuctionSessionById(id).getStatus().equals("PROGRESSING")){
            log.error("Auction session is in progress");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if(auctionSessionService.getAuctionSessionById(id).getDeposits().stream()
                .anyMatch(depositDTO -> depositDTO.getPayment().getAccountId()==a.getAccountId())){
            log.error("Account has already registered for this auction session");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(auctionSessionService.registerAuctionSession(id, a.getAccountId()), HttpStatus.OK);
    }



}
