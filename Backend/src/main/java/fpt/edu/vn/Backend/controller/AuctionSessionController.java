package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.AuctionSessionDTO;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auction-session")
public class AuctionSessionController {

    @GetMapping("/")
    public ResponseEntity<Page<AuctionSessionDTO>> getAllAuctionSession() {
        return null;
    }


    @GetMapping("/{id}")
    public ResponseEntity<AuctionSessionDTO> getAuctionSessionById( @PathVariable String id) {
        return null;
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
    public ResponseEntity<Page<AuctionSessionDTO>> getCompletedAuctionSession() {
        return null;
    }

    @GetMapping("/current")
    public ResponseEntity<AuctionSessionDTO> getCurrentAuctionSession() {
        return null;
    }

    @PostMapping("/")
    public ResponseEntity<AuctionSessionDTO> createAuctionSession() {
        return null;
    }

    @PostMapping("/{id}")
    public ResponseEntity<AuctionSessionDTO> updateAuctionSession( @PathVariable String id) {
        return null;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAuctionSession( @PathVariable String id) {
        return null;
    }





}
