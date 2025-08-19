package com.rubsal.smartflow.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rubsal.smartflow.dto.GeneralSearchDTO;
import com.rubsal.smartflow.service.DashboardService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/smartflow-api/v1/dashboards")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {
    private final DashboardService dashboardService;
    @PostMapping("/getStats")
    public ResponseEntity<String> getStats(@RequestBody GeneralSearchDTO req, HttpHeaders httpHeaders,HttpServletResponse response) {

        req.setBusinessId(Integer.valueOf(response.getHeader("businessId")));
        return new ResponseEntity<String>(dashboardService.getStats(req),HttpStatus.OK);
    }


    @PostMapping("/getSalesByMonth")
    public ResponseEntity<String> getSalesByMonth(@RequestBody GeneralSearchDTO req, HttpHeaders httpHeaders,HttpServletResponse response) {

        req.setBusinessId(Integer.valueOf(response.getHeader("businessId")));
        return new ResponseEntity<String>(dashboardService.getSalesByMonth(req),HttpStatus.OK);
    }
    @PostMapping("/byMostSaled")
    public ResponseEntity<String> byMostSaled(@RequestBody GeneralSearchDTO req, HttpHeaders httpHeaders,HttpServletResponse response) {

        req.setBusinessId(Integer.valueOf(response.getHeader("businessId")));
        return new ResponseEntity<String>(dashboardService.byMostSaled(req),HttpStatus.OK);
    }
}
