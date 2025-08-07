package com.rubsal.smartflow.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "sf_cash_register")
@Data
public class SfCashRegister extends BaseWithDateDomain {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cashier_id", nullable = false)
    private SfUsers cashierId;

    @Column(name = "opened_at", nullable = false)
    private LocalDateTime openedAt;

    @Column(name = "closed_at")
    private LocalDateTime closedAt;

    @Column(name = "opening_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal openingAmount;

    @Column(name = "closing_amount", precision = 10, scale = 2)
    private BigDecimal closingAmount;

    @Column(name = "expected_amount", precision = 10, scale = 2)
    private BigDecimal expectedAmount;

    @Column(name = "difference", precision = 10, scale = 2)
    private BigDecimal difference;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "status_id", nullable = false)
    private SfStatus status; // OPEN, CLOSED

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}
