Recommended Firestore composite indexes

The app makes several compound queries that can require composite indexes. Below are the recommended indexes you should create in your Firebase project (open the Firebase Console -> Build -> Firestore -> Indexes -> Add Index). For each index the `collection` and indexed fields + order are listed.

1) Courses: isPublished + createdAt (descending)
- Collection: `courses`
- Fields:
  - `isPublished` (Ascending)
  - `createdAt` (Descending)
- Use case: `where('isPublished', '==', true).orderBy('createdAt', 'desc')` (Course listing)

2) Enrollments: userId + status + enrolledAt
- Collection: `enrollments`
- Fields:
  - `userId` (Ascending)
  - `status` (Ascending)
  - `enrolledAt` (Descending)
- Use case: `where('userId', '==', uid).where('status','==','SUCCESS').orderBy('enrolledAt','desc')` (user enrollments)

3) Payments: userId + createdAt
- Collection: `payments`
- Fields:
  - `userId` (Ascending)
  - `createdAt` (Descending)
- Use case: `where('userId','==', uid).orderBy('createdAt','desc')` (payment history)

4) Coupons: isActive + validUntil
- Collection: `coupons`
- Fields:
  - `isActive` (Ascending)
  - `validUntil` (Ascending)
- Use case: `where('isActive','==',true).where('validUntil','>', now).orderBy('validUntil','asc')` (active coupons)

Notes
- Firebase console normally returns an index creation link in the error message when a query needs an index — you can click it and it will pre-fill the index form.
- The fallback implementations in `src/firebase/services.js` will make the app work without indexes (they run a less efficient single-field query and filter client-side) but creating proper indexes is recommended for production.

How to apply via CLI (optional)
- You can generate a `firestore.indexes.json` file and deploy with `firebase deploy --only firestore:indexes` if you use the Firebase CLI. The snippet below is an example file you can use.
