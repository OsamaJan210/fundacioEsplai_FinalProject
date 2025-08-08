package com.rubsal.smartflow.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;

@Data
public class SaleDTO {
    private Integer cashierId;
    private Integer customerId;
    private Integer businessId;
    private BigDecimal totalAmount;
    private BigDecimal taxAmount;
    private BigDecimal discountAmount;
    private String paymentMethod;
    private List<SaleItemDTO> items;
}
