package com.rubsal.smartflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rubsal.smartflow.model.SfStatus;

public interface SfStatusRepo extends JpaRepository<SfStatus,Integer> {
    SfStatus findSfStatusById(Integer id);
    
}
