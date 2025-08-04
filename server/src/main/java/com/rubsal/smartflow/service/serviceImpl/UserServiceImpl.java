package com.rubsal.smartflow.service.serviceImpl;

import org.json.JSONObject;
import org.springframework.stereotype.Service;

import com.rubsal.smartflow.dto.AuthDTO;
import com.rubsal.smartflow.model.SfUsers;
import com.rubsal.smartflow.repository.SfUSerRepo;
import com.rubsal.smartflow.repository.UserPermissionRepo;
import com.rubsal.smartflow.service.UserService;
import com.rubsal.smartflow.utils.Constants;
import com.rubsal.smartflow.utils.General;
import com.rubsal.smartflow.utils.JwtUtil;
import com.rubsal.smartflow.utils.SecurityUtils;

import lombok.Data;

@Service("UserService")
@Data
public class UserServiceImpl implements UserService {
    private final SfUSerRepo uSerRepo;
    private final General general;
    private final JwtUtil jwtUtil;
    private final UserPermissionRepo userPermissionRepo;
    @Override
    public String Auth(AuthDTO req){
        try{
            SfUsers user= uSerRepo.findByEmailAndPassword(req.getEmail(),SecurityUtils.encryptMD5(req.getPassword()));
        if(user!=null){
            String token = jwtUtil.generateToken(user.getUsername());

        return general.buildResponseLogInOutput(Constants.SUCCESS, Constants.LOGIN_SUCCESSFULL,token,userPermissionRepo.findAllowedScreensByUserId(user.getUserId()).toString()).toString();

        }

        return general.buildResponseOutput(Constants.FAIL, Constants.INVALID_CREDENTIALS).toString();

        }
        catch(Exception e){
             e.printStackTrace();
            JSONObject res = general.buildResponseOutput(Constants.FAIL, e.getMessage());
            res.put("details", e);
            return res.toString();
        }
        

    }
    @Override
    public String isEmailExsist(String email){
        if (uSerRepo.findByEmail(email).size()>0) {
            return general.buildResponseOutput(Constants.SUCCESS, Constants.EMAIL_EXSIST).toString();
        }
        return general.buildResponseOutput(Constants.SUCCESS, Constants.EMAIL_NOT_EXSIST).toString();

    }
    
}
