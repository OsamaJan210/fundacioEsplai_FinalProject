package com.rubsal.smartflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rubsal.smartflow.model.SfProduct;

public interface ProductRepo extends JpaRepository<SfProduct, Integer> {
    
}
