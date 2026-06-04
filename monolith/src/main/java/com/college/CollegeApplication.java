package com.college;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CollegeApplication {
    public static void main(String[] args) {
        SpringApplication.run(CollegeApplication.class, args);
    }
}
