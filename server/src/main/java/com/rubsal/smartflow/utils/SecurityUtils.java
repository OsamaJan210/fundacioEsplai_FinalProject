package com.rubsal.smartflow.utils;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

public class SecurityUtils {
    private SecurityUtils() {
    }

    public static String encryptMD5(String plaintext) throws NoSuchAlgorithmException, UnsupportedEncodingException {
        MessageDigest md = null;
        md = MessageDigest.getInstance("MD5");

        // encoding done here
        md.update(plaintext.getBytes("UTF-8"));

        // convert to byte array
        byte raw[] = md.digest();

        // convert to string
        return Base64.getEncoder().encodeToString(raw);
    }
}
