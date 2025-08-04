package com.rubsal.smartflow.utils;

import java.util.List;

import org.json.JSONObject;
import org.springframework.stereotype.Component;

import ch.qos.logback.core.spi.ErrorCodes;

@Component
public class General {
    public JSONObject buildResponseOutput(String errorCode, String msg) {
        JSONObject res = new JSONObject();
        res.put("erc", errorCode);
        res.put("msg", msg);
        return res;
    }
    public JSONObject buildResponseObject(List data) {
        JSONObject res = new JSONObject();
        res.put("data", data).put("erc", Constants.SUCCESS);
        return res;
    }
    public JSONObject buildResponseLogInOutput(String errorCode, String msg, String token,String screen) {
        JSONObject res = new JSONObject();
        res.put("erc", errorCode);
        res.put("msg", msg);
        res.put("token", token);
        res.put("screen", screen);

        return res;
    }
    
}
