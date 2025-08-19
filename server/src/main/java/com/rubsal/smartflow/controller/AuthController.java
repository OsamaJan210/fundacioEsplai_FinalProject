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

import com.rubsal.smartflow.dto.AuthDTO;
import com.rubsal.smartflow.dto.BusinessUserDTO;
import com.rubsal.smartflow.service.BusinessService;
import com.rubsal.smartflow.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {
    private final UserService userService;
        private final BusinessService businessService;

    @PostMapping("/login")
    public ResponseEntity<String> create(@RequestBody AuthDTO req, HttpHeaders httpHeaders) {
        System.out.println();
        log.info("Service method called using @Slf4j");
        return new ResponseEntity<String>(userService.Auth(req),HttpStatus.OK);
    }
    @GetMapping("/isEmailExsist")
    public ResponseEntity<String> isEmailExsist(@RequestParam String email, HttpHeaders httpHeaders) {
        return new ResponseEntity<String>(businessService.isEmailExsist(email),HttpStatus.OK);
    }
    @GetMapping("/isEmailExsistUser")
    public ResponseEntity<String> isEmailExsistUser(@RequestParam String email, HttpHeaders httpHeaders) {
        return new ResponseEntity<String>(userService.isEmailExsist(email),HttpStatus.OK);
    }
    @PostMapping("/create")
    public ResponseEntity<String> create(@RequestBody BusinessUserDTO req, HttpHeaders httpHeaders) {
        return new ResponseEntity<String>(businessService.createBusiness(req),HttpStatus.OK);
    }
    
}
