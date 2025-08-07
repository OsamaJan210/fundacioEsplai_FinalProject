package com.rubsal.smartflow.service.serviceImpl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.rubsal.smartflow.model.SfCashRegister;
import com.rubsal.smartflow.model.SfStatus;
import com.rubsal.smartflow.repository.RegisterRepo;
import com.rubsal.smartflow.repository.SfStatusRepo;
import com.rubsal.smartflow.service.RegisterService;
import com.rubsal.smartflow.utils.Constants;
import com.rubsal.smartflow.utils.General;

import lombok.AllArgsConstructor;

@Service("RegisterService")
@AllArgsConstructor
public class RegisterServiceImpl implements RegisterService {
    private final General general;
    private final RegisterRepo registerRepo;
    private final SfStatusRepo sfStatusRepo;

    @Override
    public String openRegister(SfCashRegister req){
        try{
            req.setOpenedAt(LocalDateTime.now());
            req.setStatus(sfStatusRepo.findSfStatusById(200001));
            System.out.println(sfStatusRepo.findSfStatusById(200001).toString());
            registerRepo.save(req);
        return general.buildResponseOutput(Constants.SUCCESS, Constants.TRANSACTION_SUCCESSFUL).toString();

        }catch(Exception ex){
        return general.buildResponseOutput(Constants.FAIL, ex.getMessage()).toString();

        }
    

    }
    @Override
    public String closeRegister(SfCashRegister req){
        
        try{
            System.out.println("Hello");
            List<SfCashRegister> opendRegisters=registerRepo.findByCashierId_UserIdAndStatus_Id(req.getCashierId().getUserId(),200001);
            if(opendRegisters.size()>0){
                SfCashRegister opendRegister=opendRegisters.get(0);
                opendRegister.setClosedAt(LocalDateTime.now());
                opendRegister.setStatus(sfStatusRepo.findSfStatusById(200002));
                opendRegister.setNotes(opendRegister.getNotes()+"-"+req.getNotes());
                registerRepo.save(opendRegister);
                return general.buildResponseOutput(Constants.SUCCESS, Constants.TRANSACTION_SUCCESSFUL).toString();
            }
            return general.buildResponseOutput(Constants.FAIL, "no active register").toString();

        

        }catch(Exception ex){
        return general.buildResponseOutput(Constants.FAIL, ex.getMessage()).toString();

        }
    

    }
    @Override
    public String registerStatusByUser(Integer id ){

        try{
            List<SfCashRegister> opendRegisters=registerRepo.findByCashierId_UserIdAndStatus_Id(id,200001);
            if(opendRegisters.size()>0){
                System.out.println("Hello from osama jan");
                return general.buildResponseOutput(Constants.SUCCESS, "register open").toString();
            }
            return general.buildResponseOutput(Constants.FAIL, "no active register").toString();

        

        }catch(Exception ex){
        return general.buildResponseOutput(Constants.FAIL, ex.getMessage()).toString();

        }
    }
}
