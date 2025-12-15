# TechBlog (Spring Boot 3.4.12)

Java Spring Boot 기반의 간단한 기술 블로그 백엔드 프로젝트입니다.  
관리자 계정으로 게시글을 작성하고, 카테고리 관리 및 이미지 업로드가 가능합니다.

---

## 🚀 주요 기능
- **JWT 인증/인가** (Spring Security)
- **게시글 CRUD + Soft Delete**
- **카테고리 관리** (생성/수정/삭제)
- **이미지 업로드** (현재: 로컬 저장 → 배포 시 AWS S3 전환 예정)
- **최신순 정렬 & 페이징**
- **댓글 기능**
- **좋아요 기능 (비회원 가능)**

---

## 🛠 기술 스택
- Java 17
- Spring Boot **3.4.12**
- Spring Security / JWT
- Spring Data JPA
- H2(개발) → MySQL(배포 예정)

---

## 📂 구조 (요약)
com.jyo.techblog<br/>
├─ auth # 로그인/회원가입, JWT<br/> 
├─ domain # Post, Category, User, Comment, PostLike<br/> 
├─ file # 이미지 업로드/조회 <br/>
└─ config # Security / WebMvc 설정<br/>

---

## 📌 현재까지 구현된 것
- 로그인/회원가입 + 권한 관리
- 게시글 작성/조회/수정/삭제(Soft Delete)
- 카테고리 등록/수정/삭제
- 이미지 업로드 → `/files/**` 로 조회 가능
- 게시글 회원/비회원의 좋아요/취소 기능

---

## ✨ 앞으로 계획
- WYSIWYG 에디터 연동
- CI/CD (GitHub Actions → EC2 배포)
- AWS S3 전환 예정
- 프론트엔드는 Next.js 기반으로 연동할 예정
