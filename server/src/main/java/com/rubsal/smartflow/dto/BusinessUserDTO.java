package com.rubsal.smartflow.dto;

import lombok.Data;

@Data
public class BusinessUserDTO {

    // Business fields
    private String businessName;
    private String businessEmail;
    private String phone;
    private String address;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    private String taxId;
    private Integer businessId;

    // User fields
    private String username;
    private String email;
    private String password;
    private String fullName;
    private Integer roleId;
}
