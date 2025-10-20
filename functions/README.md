# Firebase Cloud Functions for jntugv-certification

This `functions/` folder contains a small Express app exported as a single HTTPS function `api` that exposes an admin endpoint for toggling user account state via the Firebase Admin SDK.

## Endpoint
POST /admin/toggleUser
- Body: { uid: string, action: 'disable' | 'enable' }
- Authorization: Bearer <Firebase ID token> in Authorization header. The token must belong to a user with `admin` custom claim set to `true`.

## Deploy
From the project root (assuming Firebase CLI configured and logged in):

```bash
cd functions
npm install
cd ..
npx firebase deploy --only functions:api
```

## Notes
- This function uses `admin.auth().updateUser(uid, { disabled: true/false })` to enable/disable sign-in for the user.
- You must set a custom claim `admin: true` on at least one user (via Admin SDK) so the endpoint can be called by admins. This is a security measure.
- The front-end `toggleUserAccountStatus` will call this function; if the function call fails (network or permissions), it will fall back to updating the Firestore user's `status` field locally.
