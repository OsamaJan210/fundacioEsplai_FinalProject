package com.rubsal.smartflow.service;

import com.rubsal.smartflow.dto.AuthDTO;
import com.rubsal.smartflow.dto.UserPermissionReqDTO;
import com.rubsal.smartflow.dto.UserReqDTO;
import com.rubsal.smartflow.model.SfUserPermission;
import com.rubsal.smartflow.model.SfUsers;

public interface UserService {
    public String Auth(AuthDTO req);
    public String isEmailExsist(String email);
    public String getAllByBusinessId(Integer id);
    public String getScreenAllowdById(Integer id);
    public String createUser(UserReqDTO req);
    public String changePassword(UserReqDTO req);
    public String getUserById(Integer id);
    public String editScreenAllowd(UserPermissionReqDTO req);





}
