#!/bin/bash

echo "🚀 Deploying Firestore indexes..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    echo "❌ Please login to Firebase first:"
    echo "firebase login"
    exit 1
fi

# Deploy indexes
echo "📊 Deploying Firestore indexes..."
firebase deploy --only firestore:indexes

if [ $? -eq 0 ]; then
    echo "✅ Firestore indexes deployed successfully!"
    echo "🔗 You can view the indexes at: https://console.firebase.google.com/project/certification-cdb02/firestore/indexes"
else
    echo "❌ Failed to deploy indexes. Please check the error messages above."
    exit 1
fi

echo "🎉 Deployment complete!"