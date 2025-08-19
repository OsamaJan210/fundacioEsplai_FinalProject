package com.rubsal.smartflow.dto;

import java.util.List;

import com.rubsal.smartflow.model.SfUserPermission;

import lombok.Data;
@Data
public class UserPermissionReqDTO {
    private Integer userId;
    private List<SfUserPermission> screenList;
    
}
