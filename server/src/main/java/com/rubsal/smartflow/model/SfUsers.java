package com.rubsal.smartflow.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "sf_users")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class SfUsers {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @ManyToOne
    @JoinColumn(name = "business_id", referencedColumnName = "business_id", nullable = false)
    private SfBusiness business;

    @Column(name = "username", nullable = false, unique = true, length = 50)
    private String username;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Column(name = "full_name", length = 100)
    private String fullName;

    @Column(name = "role_id")
    private Integer roleId;

    @ManyToOne
    @JoinColumn(name = "status", referencedColumnName = "id")
    private SfStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }



    public SfUsers(SfBusiness business, String username, String email, String password,
                   String fullName, Integer roleId, SfStatus status) {
        this.business = business;
        this.username = username;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.roleId = roleId;
        this.status = status;
    }
}
