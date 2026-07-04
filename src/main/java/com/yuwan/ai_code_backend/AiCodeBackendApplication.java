package com.yuwan.ai_code_backend;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.yuwan.ai_code_backend.mapper")
public class AiCodeBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(AiCodeBackendApplication.class, args);
    }

}
