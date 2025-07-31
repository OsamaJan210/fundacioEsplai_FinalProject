package com.rubsal.smartflow.service;

import com.rubsal.smartflow.dto.BusinessUserDTO;
import com.rubsal.smartflow.model.SfBusiness;
import com.rubsal.smartflow.utils.ApiResponse;

public interface BusinessService {

    public String createBusiness(BusinessUserDTO req);
}
