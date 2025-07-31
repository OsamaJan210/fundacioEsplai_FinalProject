package com.rubsal.smartflow.utils;

import org.json.JSONObject;
import org.springframework.stereotype.Component;

@Component
public class General {
    public JSONObject buildResponseOutput(String errorCode, String msg) {
        JSONObject res = new JSONObject();
        res.put("erc", errorCode);
        res.put("msg", msg);
        return res;
    }
    
}
