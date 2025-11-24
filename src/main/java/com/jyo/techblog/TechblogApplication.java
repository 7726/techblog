package com.jyo.techblog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing  // createdAt, updatedAt 자동 세팅을 위해 필요
@SpringBootApplication
public class TechblogApplication {

	public static void main(String[] args) {
		SpringApplication.run(TechblogApplication.class, args);
	}

}
