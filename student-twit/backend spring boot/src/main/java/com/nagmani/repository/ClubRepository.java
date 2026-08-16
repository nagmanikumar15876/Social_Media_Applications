package com.nagmani.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.nagmani.model.Club;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface ClubRepository extends JpaRepository<Club, Long> {
    // JpaRepository automatically gives us findAll(), findById(), save(), and delete()

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Transactional
    @Query("UPDATE Club c SET c.president = null WHERE c.president.id = :userId")
    void removePresidentRole(@Param("userId") Long userId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Transactional
    @Query("UPDATE Club c SET c.vicePresident = null WHERE c.vicePresident.id = :userId")
    void removeVicePresidentRole(@Param("userId") Long userId);
}