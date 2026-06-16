# 📚 JNTU GV Certification Platform – Development Guide

A full‑stack, **React + Vite** frontend and **Express + MySQL + Drizzle ORM** backend that lets students browse, enroll in, and earn certification for industry‑relevant courses. The app ships with a polished UI, Google‑based SSO, rich email‑notification flows, and a highly scalable backend architecture.

---

## 1️⃣ Prerequisites

| Tool | Minimum version | Why? |
|------|----------------|------|
| **Node.js** | 20.x LTS (or newer) | Runs Vite, React, and the Express server |
| **npm** | bundled with Node | Package manager |
| **MySQL** | 8.x | Persistent data store (users, courses, enrollments, payments) |
| **Git** | any | Source‑control (optional but recommended) |
| **REST client** | – | Test API endpoints manually |

Verify installations:

```bash
node --version
npm --version
mysql --version
```

---

## 2️⃣ Project Setup

```bash
# Clone the repo (if you haven’t already)
git clone <repo‑url>
cd jntugv-certification

# Install all dependencies (frontend + backend share the same node_modules)
npm install
```

### 2.1 Environment variables
Create a **`.env`** file in the repository root. It is automatically loaded by the backend (`dotenv/config`) and strictly validated on startup using **Zod**. The server will crash immediately if required variables are missing.

```dotenv
# ── Backend (Express + Drizzle) ─────────────────────
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=jntugv_certification

# JWT secret for auth middleware
JWT_SECRET=choose-a-strong-secret

# Server port (default 3000)
PORT=3000
NODE_ENV=development

# CORS Policy - strictly enforced array of allowed origins
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# ── Frontend (Vite) ───────────────────────────────
# API proxy – Vite forwards `/api/*` to the backend.
VITE_DEV_BACKEND_TARGET=http://localhost:3000   # dev only
```

> **Security Note:** There are no hardcoded secret fallbacks in the codebase. All credentials must be securely provided via the `.env` file.

---

## 3️⃣ Database & Migrations

The application uses **MySQL** connection pooling for high scalability, and **Drizzle Kit** for schema migrations. We do NOT execute runtime DDL operations on server boot.

### 3.1 Initial Setup
1. Create the database manually:
```sql
CREATE DATABASE IF NOT EXISTS jntugv_certification
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

2. Push the schema to the database. Drizzle will introspect the database and apply the tables defined in `backend/db/schema.js`:
```bash
npm run db:push
```

### 3.2 Migration Workflow
When you change `backend/db/schema.js`, run the following commands to generate and apply migrations:
```bash
# Generate a new migration SQL file
npm run db:generate

# Apply migrations to the database
npm run db:migrate

# Open Drizzle Studio to inspect the database visually
npm run db:studio
```

---

## 4️⃣ Running the Application

### 4.1 Development Mode
You can run both the frontend and backend concurrently using:
```bash
npm run dev
```

Alternatively, run them separately:
- **Backend:** `npm run dev:backend` (runs on `http://localhost:3000`)
- **Frontend:** `npm run dev:frontend` (runs on `http://localhost:5173`)

### 4.2 Application Architecture Highlights
- **Connection Pooling:** Database queries are automatically multiplexed through a pool to prevent bottlenecking under heavy load.
- **Centralized Error Handling:** All async routes are wrapped via an `asyncHandler` and pipe errors to a global error middleware that secures stack traces in production.
- **Secure CORS & Headers:** Uses Helmet and an environment-driven `CORS_ORIGINS` whitelist to strictly prevent Cross-Site Request Forgery.
- **Rate Limiting:** Protects the API from brute-force and DDoS attacks.

---

## 5️⃣ Feature Workflows

### 5.1 Authentication
| Step | API Route | Description |
|------|-----------|-------------|
| **Sign‑Up** | `POST /api/auth/signup` | Creates a new user, hashes password. |
| **Sign‑In** | `POST /api/auth/login` | Validates credentials, returns JWT. |
| **Forgot/Reset** | `POST /api/auth/forgot-password` | Generates OTP, updates password via verification. |
| **Google SSO** | `POST /api/auth/google` | Verifies Google ID token. |

### 5.2 Admin Dashboard
Protected by `requiredRole="admin"`. Admin features include:
- Course Management (`GET/POST /api/courses`)
- User Management (`GET /api/users`)
- Enrollments (`GET/POST /api/enrollments`)
- Certificates (`GET/PUT /api/certifications`)

---

## 6️⃣ Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|---------------|-----|
| **App Crashes on Boot** | Invalid `.env` config | Check console output. Zod will print exact missing/invalid variables. |
| **CORS errors** | Origin not in whitelist | Add your frontend URL to `CORS_ORIGINS` in `.env` (comma-separated, no spaces). |
| **Database Connection Failure** | Wrong MySQL credentials or server down | Verify `DB_*` variables in `.env`, ensure MySQL service is running. |
| **Table 'users' doesn't exist** | Migrations not run | Stop the server and run `npm run db:push`. |

---

## 7️⃣ Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feat/awesome-feature`).
3. Follow the code style and use `npm run lint`.
4. Submit a PR.

---

## 🔖 License
MIT – see `LICENSE` file.

---

*Happy building! 🎉*
