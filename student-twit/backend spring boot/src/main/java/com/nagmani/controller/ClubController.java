package com.nagmani.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.nagmani.model.Club;
import com.nagmani.model.ClubEvent;
import com.nagmani.model.User;
import com.nagmani.request.ClubEventRequest;
import com.nagmani.request.ClubRequest;
import com.nagmani.service.ClubService;
import com.nagmani.service.UserService;

@RestController
@RequestMapping("/api/clubs")
public class ClubController {

    private ClubService clubService;
    private UserService userService;

    public ClubController(ClubService clubService, UserService userService) {
        this.clubService = clubService;
        this.userService = userService;
    }

    // --- CLUB MANAGEMENT ENDPOINTS ---

    @PostMapping("/create")
    public ResponseEntity<Club> createClub(@RequestBody ClubRequest req,
                                           @RequestHeader("Authorization") String jwt) throws Exception {
        User reqUser = userService.findUserProfileByJwt(jwt);
        Club createdClub = clubService.createClub(req, reqUser);
        return new ResponseEntity<>(createdClub, HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Club>> getAllClubs() {
        List<Club> clubs = clubService.getAllClubs();
        return new ResponseEntity<>(clubs, HttpStatus.OK);
    }

    @GetMapping("/{clubId}")
    public ResponseEntity<Club> getClubById(@PathVariable Long clubId) throws Exception {
        Club club = clubService.getClubById(clubId);
        return new ResponseEntity<>(club, HttpStatus.OK);
    }

    @PutMapping("/{clubId}/update")
    public ResponseEntity<Club> updateClub(@PathVariable Long clubId,
                                           @RequestBody ClubRequest req,
                                           @RequestHeader("Authorization") String jwt) throws Exception {
        User reqUser = userService.findUserProfileByJwt(jwt);
        Club updatedClub = clubService.updateClub(clubId, req, reqUser);
        return new ResponseEntity<>(updatedClub, HttpStatus.OK);
    }

    @DeleteMapping("/{clubId}/delete")
    public ResponseEntity<String> deleteClub(@PathVariable Long clubId,
                                             @RequestHeader("Authorization") String jwt) throws Exception {
        User reqUser = userService.findUserProfileByJwt(jwt);
        clubService.deleteClub(clubId, reqUser);
        return new ResponseEntity<>("Club deleted successfully", HttpStatus.OK);
    }

    // --- EVENT MANAGEMENT ENDPOINTS ---

    @PostMapping("/events/create")
    public ResponseEntity<ClubEvent> createClubEvent(@RequestBody ClubEventRequest req,
                                                     @RequestHeader("Authorization") String jwt) throws Exception {
        User reqUser = userService.findUserProfileByJwt(jwt);
        ClubEvent createdEvent = clubService.createEvent(req, reqUser);
        return new ResponseEntity<>(createdEvent, HttpStatus.CREATED);
    }

    @GetMapping("/{clubId}/events")
    public ResponseEntity<List<ClubEvent>> getClubEvents(@PathVariable Long clubId) throws Exception {
        List<ClubEvent> events = clubService.getClubEvents(clubId);
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @DeleteMapping("/events/{eventId}/delete")
    public ResponseEntity<String> deleteClubEvent(@PathVariable Long eventId,
                                                  @RequestHeader("Authorization") String jwt) throws Exception {
        User reqUser = userService.findUserProfileByJwt(jwt);
        clubService.deleteEvent(eventId, reqUser);
        return new ResponseEntity<>("Event deleted successfully", HttpStatus.OK);
    }
}