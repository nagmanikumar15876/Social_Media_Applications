package com.nagmani.service;

import java.util.List;
import com.nagmani.exception.UserException;
import com.nagmani.model.Club;
import com.nagmani.model.ClubEvent;
import com.nagmani.model.User;
import com.nagmani.request.ClubEventRequest;
import com.nagmani.request.ClubRequest;

public interface ClubService {

    // Club Management
    Club createClub(ClubRequest req, User adminUser) throws Exception;
    List<Club> getAllClubs();
    Club getClubById(Long clubId) throws Exception;
    Club updateClub(Long clubId, ClubRequest req, User reqUser) throws Exception;
    void deleteClub(Long clubId, User adminUser) throws Exception;

    // Event Management
    ClubEvent createEvent(ClubEventRequest req, User reqUser) throws Exception;
    List<ClubEvent> getClubEvents(Long clubId) throws Exception;
    void deleteEvent(Long eventId, User reqUser) throws Exception;
}