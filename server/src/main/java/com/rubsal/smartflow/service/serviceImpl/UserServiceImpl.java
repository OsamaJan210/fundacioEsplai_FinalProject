package com.rubsal.smartflow.service.serviceImpl;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONObject;
import org.springframework.stereotype.Service;

import com.rubsal.smartflow.dto.AuthDTO;
import com.rubsal.smartflow.dto.BusinessUserDTO;
import com.rubsal.smartflow.dto.UserPermissionReqDTO;
import com.rubsal.smartflow.dto.UserReqDTO;
import com.rubsal.smartflow.model.SfBusiness;
import com.rubsal.smartflow.model.SfUserPermission;
import com.rubsal.smartflow.model.SfUsers;
import com.rubsal.smartflow.repository.SfStatusRepo;
import com.rubsal.smartflow.repository.SfUSerRepo;
import com.rubsal.smartflow.repository.UserPermissionRepo;
import com.rubsal.smartflow.service.UserService;
import com.rubsal.smartflow.utils.Constants;
import com.rubsal.smartflow.utils.General;
import com.rubsal.smartflow.utils.JwtUtil;
import com.rubsal.smartflow.utils.SecurityUtils;

import jakarta.transaction.Transactional;
import lombok.Data;

@Service("UserService")
@Data
public class UserServiceImpl implements UserService {
    private final SfUSerRepo uSerRepo;
    private final General general;
    private final JwtUtil jwtUtil;
    private final UserPermissionRepo userPermissionRepo;
    private final SfStatusRepo sfStatusRepo;

    @Override
    public String Auth(AuthDTO req) {
        try {
            SfUsers user = uSerRepo.findByEmailAndPassword(req.getEmail(), SecurityUtils.encryptMD5(req.getPassword()));
            if (user != null) {
                String token = jwtUtil.generateToken(user.getEmail());

                return general.buildResponseLogInOutput(Constants.SUCCESS, Constants.LOGIN_SUCCESSFULL, token,
                        userPermissionRepo.findAllowedScreensByUserId(user.getUserId()).toString(), user.getFullName(),
                        String.valueOf(user.getBusiness().getBusinessId())).toString();

            }

            return general.buildResponseOutput(Constants.FAIL, Constants.INVALID_CREDENTIALS).toString();

        } catch (Exception e) {
            e.printStackTrace();
            JSONObject res = general.buildResponseOutput(Constants.FAIL, e.getMessage());
            res.put("details", e);
            return res.toString();
        }

    }

    @Override
    public String isEmailExsist(String email) {
        if (uSerRepo.findByEmail(email).size() > 0) {
            return general.buildResponseOutput(Constants.SUCCESS, Constants.EMAIL_EXSIST).toString();
        }
        return general.buildResponseOutput(Constants.SUCCESS, Constants.EMAIL_NOT_EXSIST).toString();

    }

    @Override
    public String getAllByBusinessId(Integer id) {
        try {

            List<SfUsers> users = uSerRepo.findByBusiness_BusinessId(id);
            return general.buildResponseObjectGeneral(users).toString();

        } catch (Exception ex) {
            return general.buildResponseOutput(Constants.FAIL, ex.getMessage()).toString();

        }
    }

    @Override
    public String getScreenAllowdById(Integer id) {
        try {

            List<SfUsers> users = uSerRepo.findByUserId(id);
            return general.buildResponseObjectGeneral(userPermissionRepo.findPermissionsByUserId(id)).toString();

        } catch (Exception ex) {
            return general.buildResponseOutput(Constants.FAIL, ex.getMessage()).toString();

        }
    }

    @Override
    @Transactional
    public String createUser(UserReqDTO req) {
        SfBusiness business = new SfBusiness();
        business.setBusinessId(req.getBusinessId());

        try {
            SfUsers sfUser = new SfUsers(business, req.getUsername(), req.getEmail(),
                    SecurityUtils.encryptMD5(req.getPassword()), req.getName(), null,
                    sfStatusRepo.findSfStatusById(100001));

            sfUser = uSerRepo.save(sfUser);
            List<SfUserPermission> permissions = new ArrayList<>();
            if (sfUser.getUserId() != null) {

                for (SfUserPermission per : req.getPermission()) {

                    per.setUserId(sfUser.getUserId());
                    permissions.add(per);
                }

            }
            userPermissionRepo.saveAll(permissions);

            return general.buildResponseOutput(Constants.SUCCESS, Constants.TRANSACTION_SUCCESSFUL).toString();
        } catch (Exception e) {
            e.printStackTrace();
            JSONObject res = general.buildResponseOutput(Constants.FAIL, e.getMessage());
            res.put("details", e);
            return res.toString();
        }
    }

    @Override
    public String changePassword(UserReqDTO req) {
        try {

            List<SfUsers> users = uSerRepo.findByUserId(req.getUserId());
            if (users.size() > 0) {
                SfUsers user = users.get(0);
                if (user.getPassword().equals(SecurityUtils.encryptMD5(req.getOldPassword()))) {

                    user.setPassword(SecurityUtils.encryptMD5(req.getPassword()));
                    uSerRepo.save(user);
                    return general.buildResponseOutput(Constants.SUCCESS, Constants.TRANSACTION_SUCCESSFUL).toString();

                }

            }
            return general.buildResponseOutput(Constants.FAIL, "invalid pasword").toString();

        } catch (Exception ex) {
            return general.buildResponseOutput(Constants.FAIL, ex.getMessage()).toString();

        }
    }

    @Override
    public String getUserById(Integer id) {
        try {
            List<SfUsers> users = uSerRepo.findByUserId(id);
            if (users.size() > 0) {
                SfUsers user = users.get(0);
                return general.buildResponseObjectGeneral(user).toString();
            }
            return general.buildResponseOutput(Constants.FAIL, "No USer Found").toString();

        } catch (Exception ex) {
            return general.buildResponseOutput(Constants.FAIL, ex.getMessage()).toString();

        }
    }

    @Override
    public String editScreenAllowd(UserPermissionReqDTO req) {
        try {
            for (SfUserPermission req1 : req.getScreenList()) {
                List<SfUserPermission> screens = userPermissionRepo.findByScreenNameAndUserId(req1.getScreenName(),
                        req.getUserId());
                if (screens.size() > 0) {
                    SfUserPermission screen = screens.get(0);
                    screen.setAllowed(req1.isAllowed());
                    userPermissionRepo.save(screen);

                }

            }

            return general.buildResponseObjectGeneral(userPermissionRepo.findPermissionsByUserId(req.getUserId()))
                        .toString();

        } catch (Exception ex) {
            return general.buildResponseOutput(Constants.FAIL, ex.getMessage()).toString();

        }
    }
}
