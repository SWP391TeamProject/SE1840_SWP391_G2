package fpt.edu.vn.Backend.controller;

import fpt.edu.vn.Backend.DTO.NotificationDTO;
import fpt.edu.vn.Backend.service.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/notification")
@CrossOrigin("*")
@Slf4j
public class NotificationController {
    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/")
    public ResponseEntity<Page<NotificationDTO>> getNotification(Principal principal, @PageableDefault(size = 50) Pageable pageable) {
        return new ResponseEntity<>(notificationService.getNotifications(pageable, principal.getName()), HttpStatus.OK);
    }

    @PostMapping("/read/{id}")
    public ResponseEntity<Void> markRead(Principal principal, @PathVariable int id) {
        try {
            if (!notificationService.markNotificationRead(id, principal.getName())) {
                return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
            }
        } catch (IllegalAccessException e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
