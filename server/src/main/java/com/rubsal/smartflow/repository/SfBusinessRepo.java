package com.rubsal.smartflow.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.rubsal.smartflow.model.SfBusiness;

public interface SfBusinessRepo  extends JpaRepository<SfBusiness,Integer> {
    List<SfBusiness> findByEmail(String emailorTaxNumber);
}
