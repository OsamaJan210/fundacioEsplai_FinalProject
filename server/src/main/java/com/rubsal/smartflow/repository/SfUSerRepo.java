package com.rubsal.smartflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rubsal.smartflow.model.SfUsers;

public interface SfUSerRepo extends JpaRepository<SfUsers,Integer>{
    SfUsers findByEmailAndPassword(String email, String password);
}
