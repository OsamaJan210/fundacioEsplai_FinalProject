package com.rubsal.smartflow.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;

@Data
public class ReturnDTO {
    private Integer saleId;
    private Integer cashierId;
    private BigDecimal totalAmount;
    private BigDecimal taxAmount;
    private BigDecimal discountAmount;
    private List<ReturnItemDTO> returnItemList;
}
