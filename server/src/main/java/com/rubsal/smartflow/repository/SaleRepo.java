package com.rubsal.smartflow.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.rubsal.smartflow.model.SfSales;

public interface SaleRepo extends JpaRepository<SfSales, Integer> {
    SfSales findBySaleId(Integer saleId);

    @Query("""
                SELECT
                    SUM(s.totalAmount) AS totalSales,
                    SUM(s.taxAmount) AS totalTax,
                    SUM(CASE WHEN s.paymentMethod = 'CASH' THEN 1 ELSE 0 END) AS cashPayments,
                    SUM(CASE WHEN s.paymentMethod = 'CARD' THEN 1 ELSE 0 END) AS cardPayments
                FROM SfSales s
                WHERE s.createdAt BETWEEN :fromDate AND :toDate
                  AND (:businessId IS NULL OR s.businessId = :businessId)
            """)
    List<Object[]> getSalesReport(
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            @Param("businessId") Integer businessId);

    @Query("SELECT " +
            "MONTH(s.createdAt) as month, " +
            "SUM(s.totalAmount) as totalSales, " +
            "SUM(s.taxAmount) as totalTax, " +
            "SUM(CASE WHEN s.paymentMethod = 'CASH' THEN 1 ELSE 0 END) as cashPayments, " +
            "SUM(CASE WHEN s.paymentMethod = 'CARD' THEN 1 ELSE 0 END) as cardPayments " +
            "FROM SfSales s WHERE " +
            // "s.createdAt BETWEEN :fromDate AND :toDate AND" +
            " (:businessId IS NULL OR s.businessId = :businessId) " +
            "GROUP BY MONTH(s.createdAt) " +
            "ORDER BY MONTH(s.createdAt)")
    List<Object[]> getSalesByMonth(
            // @Param("fromDate") LocalDateTime fromDate,
            // @Param("toDate") LocalDateTime toDate,
            @Param("businessId") Integer businessId);

    @Query(value = "SELECT \r\n" + //
                "    sp.name, \r\n" + //
                "    SUM(ssi.quantity) AS maxi\r\n" + //
                "FROM sf_sale_items ssi\r\n" + //
                "LEFT JOIN sf_products sp ON ssi.product_id = sp.id\r\n" + //
                "LEFT JOIN sf_sales ss ON ssi.sale_id = ss.sale_id\r\n" + //
                "WHERE ss.business_id = :businessId\r\n" + //
                "GROUP BY sp.name\r\n" + //
                "ORDER BY maxi DESC;", nativeQuery = true)
    List<Object[]> byMostSaled(
            // @Param("fromDate") LocalDateTime fromDate,
            // @Param("toDate") LocalDateTime toDate,
            @Param("businessId") Integer businessId);

}
