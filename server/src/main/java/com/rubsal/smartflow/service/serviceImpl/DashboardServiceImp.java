package com.rubsal.smartflow.service.serviceImpl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.rubsal.smartflow.dto.GeneralSearchDTO;
import com.rubsal.smartflow.repository.SaleRepo;
import com.rubsal.smartflow.service.DashboardService;
import com.rubsal.smartflow.utils.Constants;
import com.rubsal.smartflow.utils.General;

import lombok.AllArgsConstructor;

@Service("DashboardService")
@AllArgsConstructor
public class DashboardServiceImp implements DashboardService {
    private final General general;
    private final SaleRepo saleRepo;

    @Override
    public String getStats(GeneralSearchDTO req) {
        System.out.println(req.getBusinessId());
        List<Object[]> results = saleRepo.getSalesReport(
                req.getFromDate(),
                req.getToDate(),
                req.getBusinessId());

        return general.buildResponseObject(results).toString();

    }
    @Override
    public String getSalesByMonth(GeneralSearchDTO req) {
        System.out.println("Get Sale By MOnth"+req.getBusinessId());
        List<Object[]> results = saleRepo.getSalesByMonth(
                // req.getFromDate(),
                // req.getToDate(),
                req.getBusinessId());

        return general.buildResponseObject(results).toString();

    }
    @Override
    public String byMostSaled(GeneralSearchDTO req) {
        System.out.println("Get Sale By MOnth"+req.getBusinessId());
        List<Object[]> results = saleRepo.byMostSaled(
                // req.getFromDate(),
                // req.getToDate(),
                req.getBusinessId());

        return general.buildResponseObject(results).toString();

    }

}
