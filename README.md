# Certification Platform (React + Vite + Firebase + Razorpay)

## Setup

1. Create a Firebase project and enable Authentication (Email/Password) and Firestore.
2. Copy `.env.example` to `.env` and fill your Firebase and Razorpay keys.
3. Install dependencies and run the dev server:

```bash
npm i
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Routes

- `/auth/signin`, `/auth/signup`
- `/courses` for catalog and enrollment
- `/learn/:courseId` protected content
- `/admin` protected; requires `users/{uid}.isAdmin = true` in Firestore

## Admin bootstrap scripts

Two Node scripts are provided to manage admin access using the Firebase Admin SDK.

Prerequisites:
- Create a Firebase service account key (JSON) and save its path to env variable `GOOGLE_APPLICATION_CREDENTIALS` or set `FIREBASE_SERVICE_ACCOUNT_PATH`.
- Set your Firebase project ID via env `FIREBASE_PROJECT_ID` (optional if present inside the service account JSON).

Install deps and run:

```bash
npm i

# Create a brand-new admin user
# Required env: GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT_PATH
# Usage: EMAIL=admin@example.com PASSWORD=StrongPass123 NAME="Admin User" npm run create:admin

# Grant admin to an existing Firebase Auth user by UID or email
# Usage with UID: UID=yourAuthUid npm run grant:admin
# Usage with email: EMAIL=user@example.com npm run grant:admin
```