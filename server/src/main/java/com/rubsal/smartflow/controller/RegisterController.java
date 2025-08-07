package com.rubsal.smartflow.controller;

import java.net.http.HttpResponse;
import java.util.List;

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

import com.rubsal.smartflow.model.SfCashRegister;
import com.rubsal.smartflow.model.SfProduct;
import com.rubsal.smartflow.model.SfUsers;
import com.rubsal.smartflow.repository.SfUSerRepo;
import com.rubsal.smartflow.service.RegisterService;
import com.rubsal.smartflow.utils.Constants;
import com.rubsal.smartflow.utils.General;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/smartflow-api/v1/register")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RegisterController {
    private final RegisterService registerService;
        private final SfUSerRepo uSerRepo;
        private final General general;


    @PostMapping("/open")
    public ResponseEntity<String> openRegister(@RequestBody SfCashRegister req, HttpHeaders httpHeaders,HttpServletResponse response) {
        List<SfUsers> users=uSerRepo.findByUserId(Integer.valueOf(response.getHeader("userId")));
        if (users.size()>0) {
            req.setCashierId(users.get(0));
            System.out.println("OSama JAn HEre "+response.getHeader("userId"));
        return new ResponseEntity<String>(registerService.openRegister(req),HttpStatus.OK);
        }
        return new ResponseEntity<String>(general.buildResponseOutput(Constants.FAIL, Constants.TRANSACTION_NOT_SUCCESSFUL).toString(),HttpStatus.OK);
        

    }
    @PostMapping("/close")
    public ResponseEntity<String> closeRegister(@RequestBody SfCashRegister req, HttpHeaders httpHeaders,HttpServletResponse response) {
        List<SfUsers> users=uSerRepo.findByUserId(Integer.valueOf(response.getHeader("userId")));
        if (users.size()>0) {
            req.setCashierId(users.get(0));
            System.out.println("OSama JAn HEre "+response.getHeader("userId"));
        return new ResponseEntity<String>(registerService.closeRegister(req),HttpStatus.OK);
        }
        return new ResponseEntity<String>(general.buildResponseOutput(Constants.FAIL, Constants.TRANSACTION_NOT_SUCCESSFUL).toString(),HttpStatus.OK);
        

    }
    @GetMapping("/status")
    public ResponseEntity<String> getallByCategory(HttpHeaders httpHeaders,HttpServletResponse response) {

        System.out.println("Hello from controller ");
        return new ResponseEntity<String>(registerService.registerStatusByUser(Integer.valueOf(response.getHeader("userId"))),HttpStatus.OK);

    }
}
