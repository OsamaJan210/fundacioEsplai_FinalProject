package com.rubsal.smartflow.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rubsal.smartflow.model.SfBusiness;
import com.rubsal.smartflow.model.SfCategory;
import com.rubsal.smartflow.model.SfUsers;

public interface SfUSerRepo extends JpaRepository<SfUsers,Integer>{
    SfUsers findByEmailAndPassword(String email, String password);
    List<SfUsers> findByEmail(String email);
    List<SfUsers> findByUserId(Integer userId);
    List<SfUsers> findByBusiness_BusinessId(Integer businessId);
    


}
