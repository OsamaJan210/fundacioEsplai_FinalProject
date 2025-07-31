package com.rubsal.smartflow.controller;

import java.net.http.HttpHeaders;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rubsal.smartflow.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/smartflow-api/V1/User")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {
    private final UserService userService;
    @GetMapping("/isEmailExsist")
    public ResponseEntity<String> isEmailExsist(@RequestParam String email, HttpHeaders httpHeaders) {
        return new ResponseEntity<String>(userService.isEmailExsist(email),HttpStatus.OK);
    }
    
}
