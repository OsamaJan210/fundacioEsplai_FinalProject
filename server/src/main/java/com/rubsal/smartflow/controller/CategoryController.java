package com.rubsal.smartflow.controller;

import java.util.Locale.Category;

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

import com.rubsal.smartflow.dto.BusinessUserDTO;
import com.rubsal.smartflow.model.SfCategory;
import com.rubsal.smartflow.service.CategoryService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/smartflow-api/v1/category")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping("/create")
    public ResponseEntity<String> create(@RequestBody SfCategory req) {
        return new ResponseEntity<String>(categoryService.createCategory(req),HttpStatus.OK);
    }
    @PostMapping("/update")
    public ResponseEntity<String> update(@RequestBody SfCategory req) {
        
        return new ResponseEntity<String>(categoryService.updateCategory(req),HttpStatus.OK);
    }

    @GetMapping("/getAll/{businessid}")
    public ResponseEntity<String> getAll(@PathVariable("businessid") Integer id,HttpHeaders httpHeaders) {
        return new ResponseEntity<String>(categoryService.gatAllCategory(id),HttpStatus.OK);
    }
    @GetMapping("/get/{id}")
    public ResponseEntity<String> getById(@PathVariable("id") Integer id,HttpHeaders httpHeaders) {
        return new ResponseEntity<String>(categoryService.getById(id),HttpStatus.OK);
    }
    
}
