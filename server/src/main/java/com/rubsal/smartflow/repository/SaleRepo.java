package com.rubsal.smartflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rubsal.smartflow.model.SfSales;

public interface SaleRepo extends JpaRepository<SfSales,Integer>{
    SfSales findBySaleId(Integer saleId);
    
    
}
