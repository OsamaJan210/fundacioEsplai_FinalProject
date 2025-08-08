package com.rubsal.smartflow.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rubsal.smartflow.dto.ReturnDTO;
import com.rubsal.smartflow.dto.SaleDTO;
import com.rubsal.smartflow.service.SaleService;
import com.rubsal.smartflow.service.UserService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/smartflow-api/v1/sale")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SaleController {
    private final SaleService saleService;

    @PostMapping("/add")
    public ResponseEntity<String> addSale(@RequestBody SaleDTO req, HttpHeaders httpHeaders,HttpServletResponse response) {
        req.setBusinessId(Integer.valueOf(response.getHeader("businessId")));
        req.setCashierId(Integer.valueOf(response.getHeader("userId")));
        System.out.println(req.toString());
        return new ResponseEntity<String>(saleService.addSale(req),HttpStatus.OK);
    }

    @PostMapping("/return")
    public ResponseEntity<String> returnItem(@RequestBody ReturnDTO req, HttpHeaders httpHeaders,HttpServletResponse response) {
        req.setCashierId(Integer.valueOf(response.getHeader("userId")));
        System.out.println(req.toString());
        return new ResponseEntity<String>(saleService.returnItem(req),HttpStatus.OK);
    }
}
