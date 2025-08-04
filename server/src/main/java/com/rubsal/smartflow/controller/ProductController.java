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

import com.rubsal.smartflow.model.SfCategory;
import com.rubsal.smartflow.model.SfProduct;
import com.rubsal.smartflow.service.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/smartflow-api/V1/product")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {
    private final ProductService productService;
    @PostMapping("/create")
    public ResponseEntity<String> create(@RequestBody SfProduct req, HttpHeaders httpHeaders) {
        return new ResponseEntity<String>(productService.createProduct(req),HttpStatus.OK);
    }
    //  @GetMapping("/getallByCategory/{id}")
    // public ResponseEntity<String> getallByCategory(@PathVariable("id") Integer id,HttpHeaders httpHeaders) {
    //     return new ResponseEntity<String>(productService.getById(id),HttpStatus.OK);
    // }

    
}
