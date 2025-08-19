package com.rubsal.smartflow.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sf_user_permissions")
@Data
public class SfUserPermission extends BaseWithDateDomain {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "screen_name", nullable = false)
    private String screenName;

    @Column(nullable = false)
    private boolean allowed;

    public SfUserPermission(){
        
    }
    public SfUserPermission(String screenName, boolean allowed, Integer userId) {
        this.screenName = screenName;
        this.allowed = allowed;
        this.userId = userId;
    }
    
}

