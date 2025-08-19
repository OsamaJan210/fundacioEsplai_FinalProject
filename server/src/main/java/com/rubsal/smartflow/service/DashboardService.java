package com.rubsal.smartflow.service;

import com.rubsal.smartflow.dto.GeneralSearchDTO;

public interface DashboardService {
    public String getStats(GeneralSearchDTO req);
    public String getSalesByMonth(GeneralSearchDTO req);
    public String byMostSaled(GeneralSearchDTO req);


}
