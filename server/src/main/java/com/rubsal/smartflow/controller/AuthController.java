package com.rubsal.smartflow.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rubsal.smartflow.dto.AuthDTO;
import com.rubsal.smartflow.dto.BusinessUserDTO;
import com.rubsal.smartflow.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j;
import lombok.extern.slf4j.Slf4j;
@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {
    private final UserService userService;
    @PostMapping("/login")
    public ResponseEntity<String> create(@RequestBody AuthDTO req, HttpHeaders httpHeaders) {
        System.out.println();
        log.info("Service method called using @Slf4j");
        return new ResponseEntity<String>(userService.Auth(req),HttpStatus.OK);
    }
    
}
