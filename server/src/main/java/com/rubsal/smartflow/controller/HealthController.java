package com.rubsal.smartflow.controller;

import jakarta.annotation.PostConstruct;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/smartflow-api/v1")

public class HealthController {

    @PostConstruct
    public void init() {
        System.out.println("✅ HealthController Loaded!");
    }

    @GetMapping("/health")
    public String health() {
        return "Hello, from Smartflow by RubSal!";
    }

}
