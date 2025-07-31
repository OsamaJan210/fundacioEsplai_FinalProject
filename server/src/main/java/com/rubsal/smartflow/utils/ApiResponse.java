package com.rubsal.smartflow.utils;

import org.json.JSONObject;

import com.fasterxml.jackson.annotation.JsonView;
import com.rubsal.smartflow.view.View;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonView(View.Login.class)
public class ApiResponse<T> {

    private String code;
    private Boolean status;
    private String message;
    private T data;

    public JSONObject buildResponseOutput(String errorCode, String msg) {
        JSONObject res = new JSONObject();
        res.put("erc", errorCode);
        res.put("msg", msg);
        return res;
    }
}
