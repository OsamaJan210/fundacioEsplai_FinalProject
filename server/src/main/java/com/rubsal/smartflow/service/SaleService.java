package com.rubsal.smartflow.service;

import com.rubsal.smartflow.dto.ReturnDTO;
import com.rubsal.smartflow.dto.SaleDTO;

public interface SaleService {
    public String addSale(SaleDTO req);
    public String returnItem(ReturnDTO req);

    
}
