package com.nagmani.repository;

import com.nagmani.model.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ChatRepository extends JpaRepository<Chat, Integer> {

//    @Query("SELECT c FROM Chat c JOIN c.users u WHERE u.id = :userId")
//    List<Chat> findByUserId(@Param("userId") Long userId);

    @Query("""
    SELECT DISTINCT c
    FROM Chat c
    JOIN c.users u
    WHERE u.id = :userId
    ORDER BY c.lastMessageTime DESC
    """)
    List<Chat> findByUserId(@Param("userId") Long userId);

    @Query("""
    SELECT c
    FROM Chat c
    WHERE c IN (
        SELECT c1
        FROM Chat c1
        JOIN c1.users u
        WHERE u.id = :userId1
    )
    AND c IN (
        SELECT c2
        FROM Chat c2
        JOIN c2.users u
        WHERE u.id = :userId2
    )
""")
    List<Chat> findExistingChat(
            @Param("userId1") Long userId1,
            @Param("userId2") Long userId2);

}
