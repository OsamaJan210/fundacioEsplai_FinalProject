package com.rubsal.smartflow.service.serviceImpl;

import com.rubsal.smartflow.dto.BusinessUserDTO;
import com.rubsal.smartflow.model.SfBusiness;
import com.rubsal.smartflow.model.SfUserPermission;
import com.rubsal.smartflow.model.SfUsers;
import com.rubsal.smartflow.repository.SfBusinessRepo;
import com.rubsal.smartflow.repository.SfStatusRepo;
import com.rubsal.smartflow.repository.SfUSerRepo;
import com.rubsal.smartflow.repository.UserPermissionRepo;
import com.rubsal.smartflow.service.BusinessService;
import com.rubsal.smartflow.service.EmailService;
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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.zip.Checksum;

@Service("BusinessService")
@AllArgsConstructor
public class BusinessServiceImpl implements BusinessService {
    private final SfBusinessRepo sfBusinessRepo;
    private final SfStatusRepo sfStatusRepo;
    private final SfUSerRepo sfUSerRepo;
    private final General general;
    private final UserPermissionRepo userPermissionRepo;
    private final EmailService emailService;

    @Override
    @Transactional
    public String createBusiness(BusinessUserDTO req) {
        SfBusiness business = new SfBusiness(req.getBusinessName(), req.getBusinessEmail(), req.getPhone(),
                req.getAddress(), req.getCity(), req.getState(),
                req.getPostalCode(), req.getCountry(), req.getTaxId(),
                sfStatusRepo.findSfStatusById(100001));

        try {
            SfBusiness sfBusiness = sfBusinessRepo.save(business);
            if (sfBusiness.getBusinessId() != null) {
                SfUsers sfUser = new SfUsers(sfBusiness, req.getUsername(), req.getEmail(),
                        SecurityUtils.encryptMD5(req.getPassword()), req.getFullName(), null,
                        sfStatusRepo.findSfStatusById(100001));

                sfUser = sfUSerRepo.save(sfUser);
                if (sfUser.getUserId() != null) {

                    List<SfUserPermission> permissions = new ArrayList<>();

                    permissions.add(new SfUserPermission("Product", true,sfUser.getUserId()));
                    permissions.add(new SfUserPermission("Settings", true,sfUser.getUserId()));
                    permissions.add(new SfUserPermission("POS", true,sfUser.getUserId()));
                    permissions.add(new SfUserPermission("Dashboard", true,sfUser.getUserId()));
                    userPermissionRepo.saveAll(permissions);
                    Map<String, Object> model = new HashMap<>();
                    model.put("name", sfUser.getFullName());
                    model.put("company", sfBusiness.getBusinessName());
                    model.put("email", sfUser.getEmail());
                    model.put("date", LocalDate.now().toString());
            
                    emailService.sendWelcomeEmail(
                            "wallapop0210@gmail.com",
                            "Welcome to Business Essentials!",
                            "welcome.vm",
                            model
                    );
                }

            }
            return general.buildResponseOutput(Constants.SUCCESS, Constants.TRANSACTION_SUCCESSFUL).toString();
        } catch (Exception e) {
            e.printStackTrace();
            JSONObject res = general.buildResponseOutput(Constants.FAIL, e.getMessage());
            res.put("details", e);
            return res.toString();
        }
    }

    @Override
    public String isEmailExsist(String email) {

        if (sfBusinessRepo.findByEmail(email).size() > 0) {
            return general.buildResponseOutput(Constants.SUCCESS, Constants.EMAIL_EXSIST).toString();
        }
        return general.buildResponseOutput(Constants.SUCCESS, Constants.EMAIL_NOT_EXSIST).toString();

    }

    public String getById(Integer id) {
        try {

            SfBusiness business = sfBusinessRepo.findByBusinessId(id);
           
            return general.buildResponseObjectGeneral(business).toString();

        } catch (Exception ex) {
            return general.buildResponseOutput(Constants.FAIL, ex.getMessage()).toString();

        }
    }
    public String editBusiness(BusinessUserDTO req) {

        try {
            SfBusiness sfBusiness = sfBusinessRepo.findByBusinessId(req.getBusinessId());
            if (sfBusiness.getBusinessId() != null) {
                sfBusiness.setAddress(req.getAddress());
                sfBusiness.setCity(req.getCity());
                sfBusiness.setState(req.getState());
                sfBusiness.setCountry(req.getCountry());
                sfBusiness.setPhone(req.getPhone());
                sfBusiness.setPostalCode(req.getPostalCode());

                sfBusinessRepo.save(sfBusiness);
                return general.buildResponseOutput(Constants.SUCCESS, Constants.TRANSACTION_SUCCESSFUL).toString();
                
            }
            return general.buildResponseOutput(Constants.FAIL, Constants.TRANSACTION_NOT_SUCCESSFUL).toString();
            
        } catch (Exception e) {
            e.printStackTrace();
            JSONObject res = general.buildResponseOutput(Constants.FAIL, e.getMessage());
            res.put("details", e);
            return res.toString();
        }
    }
}