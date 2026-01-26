# TechBlog (A to Z Fullstack Project)

Java Spring Boot 백엔드와 Next.js 프론트엔드로 구성된 개인 기술 블로그 프로젝트입니다.
관리자 계정으로 게시글을 작성하고, 카테고리 관리, 비회원 댓글 작성, 좋아요 기능 및 이미지 업로드(S3) 등이 가능합니다.
GitHub Actions로 CI/CD를 구성 및 EC2-RDS 설정 후 Commit, Push 시 자동으로 배포되도록 구축했습니다.

---

## 배포 및 도메인 연결 완료
- [https://jyolog.cloud](https://jyolog.cloud)

## 🛠 Tech Stack

### Backend
- **Java 17**
- **Spring Boot 3.4.12**
- **Spring Data JPA, Spring Security (JWT)**
- **MySQL**

### Frontend
- **Next.js 16**
- **Tailwind CSS**
- **JavaScript**

### Infra (AWS)
- **EC2**
- **RDS**
- **S3 (Image Upload)**

### CI/CD
- **Github Actions**

---

## 📂 Project Structure

이 프로젝트는 백엔드와 프론트엔드가 분리된 구조로 관리됩니다.

```bash
techblog/
├── backend/    # Spring Boot API Server
└── frontend/   # Next.js Client Application