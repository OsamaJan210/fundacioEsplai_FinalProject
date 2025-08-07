package com.rubsal.smartflow.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rubsal.smartflow.model.SfCategory;
import com.rubsal.smartflow.model.SfProduct;

public interface ProductRepo extends JpaRepository<SfProduct, Integer> {
    List<SfProduct> findAllByBusinessId(Integer businessId);
    List<SfProduct> findAllByCategoryId(Integer categoryId);
    List<SfProduct> findAllById(Integer id);



    
}
