package com.rubsal.smartflow.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "sf_categories")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SfCategory extends BaseWithDateDomain{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(name = "description")
    private String description;

    @Column(name = "name", nullable = false, length = 255, unique = true)
    private String name;

    @Column(name = "business_id", nullable = false)
    private Long businessId;

    @Column(name = "branch_id", nullable = false)
    private Long branchId;
}
