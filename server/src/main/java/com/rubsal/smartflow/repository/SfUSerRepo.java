package com.rubsal.smartflow.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rubsal.smartflow.model.SfBusiness;
import com.rubsal.smartflow.model.SfUsers;

public interface SfUSerRepo extends JpaRepository<SfUsers,Integer>{
    SfUsers findByEmailAndPassword(String email, String password);
    List<SfUsers> findByEmail(String email);

}
