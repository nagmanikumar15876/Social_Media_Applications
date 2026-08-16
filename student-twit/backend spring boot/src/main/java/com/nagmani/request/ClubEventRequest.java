package com.nagmani.request;

import java.time.LocalDateTime;

public class ClubEventRequest {

    private String title;
    private String description;
    private String venue;
    private LocalDateTime date;
    private String image;

    // React tells us which club this event belongs to
    private Long clubId;

    // --- GETTERS AND SETTERS ---
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
    public Long getClubId() { return clubId; }
    public void setClubId(Long clubId) { this.clubId = clubId; }
}