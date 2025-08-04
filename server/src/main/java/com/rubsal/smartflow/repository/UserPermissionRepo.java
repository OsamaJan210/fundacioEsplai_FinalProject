package com.rubsal.smartflow.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.rubsal.smartflow.model.SfUserPermission;

public interface UserPermissionRepo extends JpaRepository<SfUserPermission, Integer> {
    @Query("SELECT u.screenName FROM SfUserPermission u WHERE u.userId = :userId AND u.allowed = true")
    List<String> findAllowedScreensByUserId(@Param("userId") Integer userId);
}
