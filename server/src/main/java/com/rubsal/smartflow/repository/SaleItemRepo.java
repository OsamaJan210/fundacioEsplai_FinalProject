package com.rubsal.smartflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rubsal.smartflow.model.SfSaleItem;

public interface SaleItemRepo extends JpaRepository<SfSaleItem,Integer>{
    SfSaleItem findBySale_SaleIdAndProductId(Integer saleId, Integer productId);
    
}
