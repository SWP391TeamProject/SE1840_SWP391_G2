package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.AuctionSessionDTO;
import fpt.edu.vn.Backend.service.AuctionSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@CrossOrigin("*")
@RestController
@RequestMapping("/api/auction-sessions")
public class AuctionSessionController {
    @Autowired
    private AuctionSessionService auctionSessionService;
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
    public ResponseEntity<Page<AuctionSessionDTO>> getUpcomingAuctionSession() {
        return null;
    }

    @GetMapping("/completed")
    public ResponseEntity<Page<AuctionSessionDTO>> getCompletedAuctionSession(@RequestParam(defaultValue = "0") int pageNumb,@RequestParam(defaultValue = "50") int pageSize) {
        Pageable pageable = PageRequest.of(pageNumb,pageSize);
        return new ResponseEntity<>(auctionSessionService.getPastAuctionSessions(pageable), HttpStatus.OK);
    }

    @GetMapping("/current")
    public ResponseEntity<AuctionSessionDTO> getCurrentAuctionSession() {
        return null;
    }

    @PostMapping("/")
    public ResponseEntity<AuctionSessionDTO> createAuctionSession(@RequestBody AuctionSessionDTO auctionDTO) {
        return new ResponseEntity<>(auctionSessionService.createAuctionSession(auctionDTO), HttpStatus.OK);
    }


    @PutMapping("/{id}")
    public ResponseEntity<AuctionSessionDTO> updateAuctionSession(@RequestBody AuctionSessionDTO auctionDTO) {
        return new ResponseEntity<>(auctionSessionService.updateAuctionSession(auctionDTO), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAuctionSession( @PathVariable String id) {
        return null;
    }





}
