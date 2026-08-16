package com.nagmani.service;

import java.util.List;
import org.springframework.stereotype.Service;

import com.nagmani.exception.UserException;
import com.nagmani.model.Club;
import com.nagmani.model.ClubEvent;
import com.nagmani.model.User;
import com.nagmani.repository.ClubEventRepository;
import com.nagmani.repository.ClubRepository;
import com.nagmani.request.ClubEventRequest;
import com.nagmani.request.ClubRequest;

@Service
public class ClubServiceImplementation implements ClubService {

    private ClubRepository clubRepository;
    private ClubEventRepository clubEventRepository;
    private UserService userService;

    // Constructor Injection prevents NullPointerExceptions!
    public ClubServiceImplementation(ClubRepository clubRepository, ClubEventRepository clubEventRepository, UserService userService) {
        this.clubRepository = clubRepository;
        this.clubEventRepository = clubEventRepository;
        this.userService = userService;
    }

    @Override
    public Club createClub(ClubRequest req, User adminUser) throws Exception {
        // 1. Verify this is the Main Admin
        boolean isAdmin = adminUser.getRole() != null && adminUser.getRole().toString().equals("ROLE_ADMIN");
        if (!isAdmin) {
            throw new UserException("Only the Main Admin can create a new club.");
        }

        Club club = new Club();
        club.setName(req.getName());
        club.setDescription(req.getDescription());
        club.setImage(req.getImage());
        club.setGoogleFormLink(req.getGoogleFormLink());

        // Fetch and set the President & VP using the IDs from the DTO
        if (req.getPresidentId() != null) {
            User president = userService.findUserById(req.getPresidentId());
            club.setPresident(president);
        }
        if (req.getVicePresidentId() != null) {
            User vicePresident = userService.findUserById(req.getVicePresidentId());
            club.setVicePresident(vicePresident);
        }

        return clubRepository.save(club);
    }

    @Override
    public List<Club> getAllClubs() {
        return clubRepository.findAll();
    }

    @Override
    public Club getClubById(Long clubId) throws Exception {
        return clubRepository.findById(clubId)
                .orElseThrow(() -> new Exception("Club not found with ID: " + clubId));
    }

    @Override
    public Club updateClub(Long clubId, ClubRequest req, User reqUser) throws Exception {
        Club club = getClubById(clubId);

        // 2. Permission Check: Are you the Admin OR the President of THIS specific club?
        boolean isAdmin = reqUser.getRole() != null && reqUser.getRole().toString().equals("ROLE_ADMIN");
        boolean isPresident = club.getPresident() != null && club.getPresident().getId().equals(reqUser.getId());

        if (!isAdmin && !isPresident) {
            throw new UserException("You do not have permission to manage this club.");
        }

        // Update fields (like updating the Google Form Link for recruitment!)
        if (req.getDescription() != null) club.setDescription(req.getDescription());
        if (req.getImage() != null) club.setImage(req.getImage());
        if (req.getGoogleFormLink() != null) club.setGoogleFormLink(req.getGoogleFormLink());

        return clubRepository.save(club);
    }

    @Override
    public void deleteClub(Long clubId, User adminUser) throws Exception {
        boolean isAdmin = adminUser.getRole() != null && adminUser.getRole().toString().equals("ROLE_ADMIN");
        if (!isAdmin) {
            throw new UserException("Only the Main Admin can delete a club.");
        }
        Club club = getClubById(clubId);
        clubRepository.delete(club);
    }

    @Override
    public ClubEvent createEvent(ClubEventRequest req, User reqUser) throws Exception {
        Club club = getClubById(req.getClubId());

        boolean isAdmin = reqUser.getRole() != null && reqUser.getRole().toString().equals("ROLE_ADMIN");
        boolean isPresident = club.getPresident() != null && club.getPresident().getId().equals(reqUser.getId());

        if (!isAdmin && !isPresident) {
            throw new UserException("Only the Club President or Admin can create events.");
        }

        ClubEvent event = new ClubEvent();
        event.setTitle(req.getTitle());
        event.setDescription(req.getDescription());
        event.setVenue(req.getVenue());
        event.setDate(req.getDate());
        event.setImage(req.getImage());
        event.setClub(club);

        return clubEventRepository.save(event);
    }

    @Override
    public List<ClubEvent> getClubEvents(Long clubId) throws Exception {
        return clubEventRepository.findByClubIdOrderByDateAsc(clubId);
    }

    @Override
    public void deleteEvent(Long eventId, User reqUser) throws Exception {
        ClubEvent event = clubEventRepository.findById(eventId)
                .orElseThrow(() -> new Exception("Event not found"));

        Club club = event.getClub();

        boolean isAdmin = reqUser.getRole() != null && reqUser.getRole().toString().equals("ROLE_ADMIN");
        boolean isPresident = club.getPresident() != null && club.getPresident().getId().equals(reqUser.getId());

        if (!isAdmin && !isPresident) {
            throw new UserException("You do not have permission to delete this event.");
        }

        clubEventRepository.delete(event);
    }
}