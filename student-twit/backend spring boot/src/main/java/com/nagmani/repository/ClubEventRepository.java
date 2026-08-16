package com.nagmani.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.nagmani.model.ClubEvent;

public interface ClubEventRepository extends JpaRepository<ClubEvent, Long> {

    // Custom query to fetch all events for a specific club, sorted so the newest are at the top
    List<ClubEvent> findByClubIdOrderByDateAsc(Long clubId);

}