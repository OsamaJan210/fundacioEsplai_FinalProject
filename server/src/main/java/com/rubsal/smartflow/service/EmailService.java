package com.rubsal.smartflow.service;

import java.util.Map;

public interface EmailService {
        public void sendWelcomeEmail(String to, String subject, String templateName, Map<String, Object> model);

}
