package com.lms.academics;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.lms.academics.repository", considerNestedRepositories = true)
@EnableFeignClients
public class AcademicsServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(AcademicsServiceApplication.class, args);
    }
}
