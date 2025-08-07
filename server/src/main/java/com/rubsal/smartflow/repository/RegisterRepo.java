package com.rubsal.smartflow.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rubsal.smartflow.model.SfCashRegister;

public interface RegisterRepo extends JpaRepository<SfCashRegister,Integer> {
    List<SfCashRegister> findByCashierId_UserIdAndStatus_Id(Integer userId, Integer id);
}
