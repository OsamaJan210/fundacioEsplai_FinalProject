package com.rubsal.smartflow.service.serviceImpl;

import com.rubsal.smartflow.dto.BusinessUserDTO;
import com.rubsal.smartflow.model.SfBusiness;
import com.rubsal.smartflow.model.SfUsers;
import com.rubsal.smartflow.repository.SfBusinessRepo;
import com.rubsal.smartflow.repository.SfStatusRepo;
import com.rubsal.smartflow.repository.SfUSerRepo;
import com.rubsal.smartflow.service.BusinessService;
import com.rubsal.smartflow.utils.ApiResponse;
import com.rubsal.smartflow.utils.Constants;
import com.rubsal.smartflow.utils.General;
import com.rubsal.smartflow.utils.SecurityUtils;

import ch.qos.logback.core.spi.ErrorCodes;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.Data;

import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.zip.Checksum;

@Service("BusinessService")
@AllArgsConstructor
public class BusinessServiceImpl implements BusinessService {
    private final SfBusinessRepo sfBusinessRepo;
    private final SfStatusRepo sfStatusRepo;
    private final SfUSerRepo sfUSerRepo;
    private final General general;
    @Override
    @Transactional
    public String createBusiness(BusinessUserDTO req){
        SfBusiness business=new SfBusiness(req.getBusinessName(),req.getBusinessEmail(),req.getPhone(),req.getAddress(),req.getCity(),req.getState(),
        req.getPostalCode(),req.getCountry(),req.getTaxId(),
        sfStatusRepo.findSfStatusById(100001)
    );

        try {
           SfBusiness sfBusiness= sfBusinessRepo.save(business);
           if (sfBusiness.getBusinessId()!=null) {
            SfUsers sfUser =new SfUsers(sfBusiness,req.getUsername(),req.getEmail(),SecurityUtils.encryptMD5(req.getPassword()),req.getFullName(),null,sfStatusRepo.findSfStatusById(100001));

            sfUSerRepo.save(sfUser);
            
           }
            return general.buildResponseOutput(Constants.SUCCESS, Constants.TRANSACTION_SUCCESSFUL).toString();
        }
        catch (Exception e){
            e.printStackTrace();
            JSONObject res = general.buildResponseOutput(Constants.FAIL, e.getMessage());
            res.put("details", e);
            return res.toString();
        }
    }
    @Override
    public String isEmailExsist(String email){

        if (sfBusinessRepo.findByEmail(email).size()>0) {
            return general.buildResponseOutput(Constants.SUCCESS, Constants.EMAIL_EXSIST).toString();
        }
        return general.buildResponseOutput(Constants.SUCCESS, Constants.EMAIL_NOT_EXSIST).toString();

    }
}