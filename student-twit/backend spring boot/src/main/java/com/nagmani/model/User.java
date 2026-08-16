package com.nagmani.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import com.nagmani.enums.UserRole;
import jakarta.persistence.*;
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

    private String password;

    private String mobile;

    private String image;

    private String backgroundImage;

    private String bio;

    private boolean req_user;

    private boolean login_with_google;

    private boolean is_req_user = false;

//    @ManyToMany(mappedBy = "retwitUser",cascade = CascadeType.ALL)
//    private List<Twit> retwits = new ArrayList<>();


    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Twit> twit = new ArrayList<>();


    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Like> likes = new ArrayList<>();

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
