package com.lms.examination;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class ExaminationServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ExaminationServiceApplication.class, args);
    }
}
