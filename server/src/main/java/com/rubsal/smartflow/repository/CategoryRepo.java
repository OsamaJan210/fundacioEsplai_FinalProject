package com.rubsal.smartflow.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rubsal.smartflow.model.SfCategory;

public interface CategoryRepo  extends JpaRepository<SfCategory, Integer>{
    List<SfCategory> findAllById(Integer id);
    List<SfCategory> findAllByBusinessId(Integer businessId);

}
