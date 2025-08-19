package com.rubsal.smartflow.dto;

import java.util.List;

import com.rubsal.smartflow.model.SfUserPermission;

import lombok.Data;

@Data
public class UserReqDTO {
    private Integer userId;
    private Integer businessId;
    private String name;
    private String username;
    private String email;
    private String password;
    private String oldPassword;
    private List<SfUserPermission> permission;

}
