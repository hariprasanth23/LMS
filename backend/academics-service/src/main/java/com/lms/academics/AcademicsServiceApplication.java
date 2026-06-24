package com.lms.academics;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class AcademicsServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(AcademicsServiceApplication.class, args);
    }
}
