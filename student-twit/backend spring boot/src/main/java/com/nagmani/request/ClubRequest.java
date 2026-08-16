package com.nagmani.request;

public class ClubRequest {

    private String name;
    private String description;
    private String image;
    private String googleFormLink;

    // React will only send us the IDs of the students!
    private Long presidentId;
    private Long vicePresidentId;

    // --- GETTERS AND SETTERS ---
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public String getGoogleFormLink() { return googleFormLink; }
    public void setGoogleFormLink(String googleFormLink) { this.googleFormLink = googleFormLink; }
    public Long getPresidentId() { return presidentId; }
    public void setPresidentId(Long presidentId) { this.presidentId = presidentId; }
    public Long getVicePresidentId() { return vicePresidentId; }
    public void setVicePresidentId(Long vicePresidentId) { this.vicePresidentId = vicePresidentId; }
}