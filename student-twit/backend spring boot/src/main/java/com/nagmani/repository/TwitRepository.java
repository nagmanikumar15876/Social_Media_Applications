package com.nagmani.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.nagmani.model.Twit;
import com.nagmani.model.User;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface TwitRepository extends JpaRepository<Twit, Long> {

	List<Twit> findAllByIsTwitTrueOrderByCreatedAtDesc();
	List<Twit> findByRetwitUserContainsOrUser_IdAndIsTwitTrueOrderByCreatedAtDesc(User user, Long userId);
	List<Twit> findByLikesContainingOrderByCreatedAtDesc(User user);
	
	@Query("SELECT t FROM Twit t JOIN t.likes l WHERE l.user.id = :userId")
	List<Twit> findByLikesUser_Id(Long userId);
	List<Twit> findByUserId(Long userId);

	@Modifying
	@Transactional
	@Query(value = "DELETE FROM twit_reply_twits WHERE twit_id IN (SELECT id FROM twit WHERE user_id = :userId) OR reply_twits_id IN (SELECT id FROM twit WHERE user_id = :userId)", nativeQuery = true)
	void deleteUserRepliesFromJoinTable(@Param("userId") Long userId);

	// 2. Forcefully delete likes from the join table just in case
	@Modifying
	@Transactional
	@Query(value = "DELETE FROM twit_likes WHERE twit_id IN (SELECT id FROM twit WHERE user_id = :userId)", nativeQuery = true)
	void deleteUserLikesFromJoinTable(@Param("userId") Long userId);
	
//    @Query("SELECT t FROM Twit t JOIN t.likes l WHERE l.user.id = :userId")
//    List<Twit> findTwitsByUserIdInLikes(Long userId);

}
