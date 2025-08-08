package com.rubsal.smartflow.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class SaleItemDTO {
    private Integer productId;
    private String productName;
    private BigDecimal quantity;
    private BigDecimal unitPrice;
}