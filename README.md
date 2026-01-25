# TechBlog (Fullstack Project)

Java Spring Boot 백엔드와 Next.js 프론트엔드로 구성된 개인 기술 블로그 프로젝트입니다.
관리자 계정으로 게시글을 작성하고, 카테고리 관리 및 이미지 업로드(S3)가 가능합니다.

---

## 🛠 Tech Stack

### Backend
- **Java 17**
- **Spring Boot 3.4.12**
- Spring Data JPA, Spring Security (JWT)
- MySQL (Production) / H2 (Dev)

### Frontend
- **Next.js 16** (App Router)
- **Tailwind CSS**
- **JavaScript**

### Infra (AWS)
- **EC2**
- **RDS**
- **AWS S3 (Image Upload)**

### CI/CD
- **Github Actions**

---

## 📂 Project Structure

이 프로젝트는 백엔드와 프론트엔드가 분리된 구조로 관리됩니다.

```bash
techblog/
├── backend/    # Spring Boot API Server

└── frontend/   # Next.js Client Application