package com.rubsal.smartflow.controller;

import com.rubsal.smartflow.dto.BusinessUserDTO;
import com.rubsal.smartflow.model.SfBusiness;
import com.rubsal.smartflow.service.BusinessService;
import com.rubsal.smartflow.utils.ResponseEntityResult;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/smartflow-api/v1/business")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BusinessController {

    private final ResponseEntityResult responseEntityResult;
    private final BusinessService businessService;

    @PostMapping("/edit")
    public ResponseEntity<String> create(@RequestBody BusinessUserDTO req, HttpHeaders httpHeaders) {
        return new ResponseEntity<String>(businessService.editBusiness(req),HttpStatus.OK);
    }
    // @GetMapping("/isEmailExsist")
    // public ResponseEntity<String> isEmailExsist(@RequestParam String email, HttpHeaders httpHeaders) {
    //     return new ResponseEntity<String>(businessService.isEmailExsist(email),HttpStatus.OK);
    // }

    @GetMapping("/get/{id}")
    public ResponseEntity<String> getById(@PathVariable("id") Integer id,HttpHeaders httpHeaders) {
        return new ResponseEntity<String>(businessService.getById(id),HttpStatus.OK);
    }
    
}
