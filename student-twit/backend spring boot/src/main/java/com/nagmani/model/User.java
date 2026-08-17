package com.nagmani.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.nagmani.enums.UserRole;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private UserRole role = UserRole.ROLE_USER;

    @Column(nullable = false)
    private String fullName;

    private String location;

    private String website;

    private String birthDate;

    @Column(nullable = false, unique = true)
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private String mobile;

    private String image;

    private String backgroundImage;

    private String bio;

    private boolean req_user;

    private boolean login_with_google;

    private boolean is_req_user = false;

    // =========================================================
    // COLLEGE EMAIL VERIFICATION
    // =========================================================

    @Column(nullable = false)
    private boolean emailVerified = false;

    @JsonIgnore
    private String emailOtpHash;

    @JsonIgnore
    private LocalDateTime emailOtpExpiry;

    @JsonIgnore
    private int emailOtpAttempts = 0;

    @JsonIgnore
    private LocalDateTime lastOtpSentAt;

    // =========================================================
    // EXISTING RELATIONSHIPS
    // =========================================================

    @OneToMany(
            mappedBy = "user",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonIgnore
    private List<Twit> twit = new ArrayList<>();

    @OneToMany(
            mappedBy = "user",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonIgnore
    private List<Like> likes = new ArrayList<>();

    /*
     * Existing premium/subscription verification.
     * This is NOT email verification.
     */
    @Embedded
    private Varification verification;

    @JsonIgnore
    @ManyToMany(cascade = CascadeType.ALL)
    private List<User> followers = new ArrayList<>();

    @JsonIgnore
    @ManyToMany(mappedBy = "followers")
    private List<User> followings = new ArrayList<>();

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }
}