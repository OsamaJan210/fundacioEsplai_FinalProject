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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rubsal.smartflow.dto.BusinessUserDTO;
import com.rubsal.smartflow.dto.UserPermissionReqDTO;
import com.rubsal.smartflow.dto.UserReqDTO;
import com.rubsal.smartflow.model.SfUserPermission;
import com.rubsal.smartflow.model.SfUsers;
import com.rubsal.smartflow.service.UserService;
import com.rubsal.smartflow.utils.Constants;
import com.rubsal.smartflow.utils.General;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/smartflow-api/v1/user")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {
    private final UserService userService;
    private final General general;
    @GetMapping("/isEmailExsist")
    public ResponseEntity<String> isEmailExsist(@RequestParam String email, HttpHeaders httpHeaders) {
        return new ResponseEntity<String>(userService.isEmailExsist(email),HttpStatus.OK);
    }
    @GetMapping("/getAllByBusinessId/{id}")
    public ResponseEntity<String> getAllByBusinessId(@PathVariable("id") Integer id,HttpHeaders httpHeaders) {
        return new ResponseEntity<String>(userService.getAllByBusinessId(id),HttpStatus.OK);
    }
    @GetMapping("/getScreenAllowdById/{id}")
    public ResponseEntity<String> getScreenAllowdById(@PathVariable("id") Integer id,HttpHeaders httpHeaders) {
        return new ResponseEntity<String>(userService.getScreenAllowdById(id),HttpStatus.OK);
    }
    @PostMapping("/create")
    public ResponseEntity<String> create(@RequestBody UserReqDTO req, HttpHeaders httpHeaders) {
        return new ResponseEntity<String>(userService.createUser(req),HttpStatus.OK);
    }
    @PostMapping("/changePassword")
    public ResponseEntity<String> changePassword(@RequestBody UserReqDTO req, HttpHeaders httpHeaders,HttpServletResponse response) {
        req.setUserId(Integer.valueOf(response.getHeader("userId")));
        return new ResponseEntity<String>(userService.changePassword(req),HttpStatus.OK);
    }
    @GetMapping("/get")
    public ResponseEntity<String> getById(HttpHeaders httpHeaders,HttpServletResponse response) {
        return new ResponseEntity<String>(userService.getUserById(Integer.valueOf(response.getHeader("userId"))),HttpStatus.OK);
    }
    @PostMapping("/editScreenAllowd")
    public ResponseEntity<String> editScreenAllowd(@RequestBody UserPermissionReqDTO req, HttpHeaders httpHeaders,HttpServletResponse response) {
        if(response.getHeader("userId").equals(String.valueOf(req.getUserId()))){
        return new ResponseEntity<String>(general.buildResponseOutput(Constants.FAIL, "You Cananot Change your permission").toString(),HttpStatus.OK);

        }
        return new ResponseEntity<String>(userService.editScreenAllowd(req),HttpStatus.OK);
    }
    
}
