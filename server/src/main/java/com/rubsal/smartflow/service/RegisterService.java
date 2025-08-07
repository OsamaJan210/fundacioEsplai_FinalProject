package com.rubsal.smartflow.service;

import com.rubsal.smartflow.model.SfCashRegister;

public interface RegisterService {
    public String openRegister(SfCashRegister req);
    public String closeRegister(SfCashRegister req);
    public String registerStatusByUser(Integer id);

    
}
