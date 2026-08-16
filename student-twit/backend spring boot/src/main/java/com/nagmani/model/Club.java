package com.nagmani.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Club {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(length = 2000) // 2000 chars because descriptions can be long
    private String description;

    private String image; // Club Logo from Cloudinary

    private String googleFormLink; // Dynamic form link

    // Links to your existing User table!
    @ManyToOne
    private User president;

    @ManyToOne
    private User vicePresident;

    // A club can have many events. If the club is deleted, delete the events too.
    @JsonIgnore
    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ClubEvent> events = new ArrayList<>();

    // --- GETTERS AND SETTERS ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public String getGoogleFormLink() { return googleFormLink; }
    public void setGoogleFormLink(String googleFormLink) { this.googleFormLink = googleFormLink; }
    public User getPresident() { return president; }
    public void setPresident(User president) { this.president = president; }
    public User getVicePresident() { return vicePresident; }
    public void setVicePresident(User vicePresident) { this.vicePresident = vicePresident; }
    public List<ClubEvent> getEvents() { return events; }
    public void setEvents(List<ClubEvent> events) { this.events = events; }
}