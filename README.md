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
