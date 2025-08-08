package com.rubsal.smartflow.dto;

import java.math.BigDecimal;
import java.util.function.BiConsumer;

import lombok.Data;

@Data
public class ReturnItemDTO {
    private Integer productId;
    private BigDecimal returnQuantity;
    
}
