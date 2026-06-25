package com.lms.studentservices;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.lms.studentservices.repository", considerNestedRepositories = true)
@EnableFeignClients
public class StudentServicesApplication {
    public static void main(String[] args) {
        SpringApplication.run(StudentServicesApplication.class, args);
    }
}
