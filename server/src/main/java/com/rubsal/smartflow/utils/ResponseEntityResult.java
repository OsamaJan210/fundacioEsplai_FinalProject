package com.rubsal.smartflow.utils;

import lombok.Data;
import org.hibernate.annotations.Comment;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
@Data
public class ResponseEntityResult {
    public ResponseEntity<?> responseEntity(ApiResponse apiResponse) {
        switch (apiResponse.getCode()) {
            case "400":
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .contentType(MediaType.APPLICATION_JSON).body(apiResponse);
            case "200":
                return ResponseEntity.status(HttpStatus.OK)
                        .contentType(MediaType.APPLICATION_JSON).body(apiResponse);
            case "500":
                apiResponse.setData("Please Contact Help Center");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .contentType(MediaType.APPLICATION_JSON).body(apiResponse);
            default:
                apiResponse.setStatus(false);
                apiResponse.setData("Please Contact Help Center");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .contentType(MediaType.APPLICATION_JSON).body(apiResponse);
        }
    }
}
