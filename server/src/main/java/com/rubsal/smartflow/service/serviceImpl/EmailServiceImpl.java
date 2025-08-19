package com.rubsal.smartflow.service.serviceImpl;

import java.io.StringWriter;
import java.util.Map;
import java.util.Properties;

import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.rubsal.smartflow.service.EmailService;
import com.rubsal.smartflow.utils.Constants;
import com.rubsal.smartflow.utils.General;

import jakarta.annotation.PostConstruct;
import jakarta.mail.internet.MimeMessage;
import lombok.Data;

@Service("EmailService")
@Data
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    private VelocityEngine velocityEngine;
    private final General general;

    @PostConstruct
    public void init() {
        velocityEngine = new VelocityEngine();
        Properties props = new Properties();
        props.setProperty("resource.loader", "class");
        props.setProperty("class.resource.loader.class",
                "org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader");
        velocityEngine.init(props);
    }

    @Override
    public void sendWelcomeEmail(String to, String subject, String templateName, Map<String, Object> model) {
        try {
            // Load template
            Template template = velocityEngine.getTemplate("templates/" + templateName, "UTF-8");

            // Merge model with template
            VelocityContext context = new VelocityContext(model);
            StringWriter writer = new StringWriter();
            template.merge(context, writer);

            // Create email message
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setFrom("info@rubsal.com");
            helper.setSubject(subject);
            helper.setText(writer.toString(), true); // true = HTML

            // Send email
            mailSender.send(message);
            System.out.println("\n\n\nEmail sent");
        } catch (Exception ex) {

            System.out.println("\n\n\nError Sending Email"+ex.getMessage());
        }
    }
}
