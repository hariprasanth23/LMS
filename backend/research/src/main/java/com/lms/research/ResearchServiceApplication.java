package com.lms.research;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class ResearchServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ResearchServiceApplication.class, args);
    }
}
