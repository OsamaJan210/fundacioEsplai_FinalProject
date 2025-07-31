package com.rubsal.smartflow.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sf_status")
@Data
public class SfStatus extends BaseWithDateDomain {

    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "name", nullable = false, unique = true, length = 50)
    private String name;

    @Column(name = "discription", length = 50)
    private String description;
}

