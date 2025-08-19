package com.rubsal.smartflow.dto;

import java.time.LocalDateTime;

import lombok.Data;
@Data
public class GeneralSearchDTO {
    private LocalDateTime fromDate;
    private LocalDateTime toDate;
    private Integer businessId;
}
