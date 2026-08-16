package com.nagmani.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class ClubEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 1000)
    private String description;

    private String venue;

    private LocalDateTime date;

    private String image; // Event poster from Cloudinary

    // Ties this event to a specific club
    @ManyToOne
    @JoinColumn(name = "club_id")
    private Club club;

    // --- GETTERS AND SETTERS ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }
    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public Club getClub() { return club; }
    public void setClub(Club club) { this.club = club; }
}