package com.nagmani.model;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Twit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @OnDelete(action = OnDeleteAction.CASCADE) // ADD THIS MAGIC LINE
    private User user;

    // Also find the self-referencing reply relationship and add it here:
    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE) // ADD THIS MAGIC LINE
    private Twit replyFor;



    @Column(nullable = false)
    private String content;

    // ADD THIS INSTEAD:
    @OneToMany(mappedBy = "twit", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Like> likes = new ArrayList<>();

    @OneToMany(mappedBy = "replyFor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Twit> replyTwits = new ArrayList<>();

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<User> retwitUser = new ArrayList<>();
    


    @Column(nullable = false)
    private LocalDateTime createdAt;

    private String image; 
    private String video;

    private boolean isReply;
    private boolean isTwit;
    private boolean is_liked = false;
    private boolean is_retwit=false;
    

    


}
