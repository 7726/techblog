package com.jyo.techblog;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

class TechblogApplicationTests {

	@Test
	void generatePassword() {
		// 1. 스프링 도움 없이 직접 생성 (가볍고 빠름)
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

		// 2. 원하는 비밀번호 입력
		String rawPassword = "admin1234";
		String encodedPassword = encoder.encode(rawPassword);

		System.out.println("=========================================");
		System.out.println("비밀번호 해시값: " + encodedPassword);
		System.out.println("=========================================");
	}
}