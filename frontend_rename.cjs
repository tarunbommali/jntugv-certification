const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  "src/utils/schema.js",
  "src/utils/helper/enrollmentHelpers.jsx",
  "src/utils/helper/certificationHelpers.jsx",
  "src/utils/helper/certificatePdf.js",
  "src/pages/ProfilePage.jsx",
  "src/pages/ProfileEdit.jsx",
  "src/pages/CheckoutPage.jsx",
  "src/pages/admin/user-management/UsersManagement.jsx",
  "src/pages/admin/user-management/UserManagementForm.jsx",
  "src/pages/admin/enrollment-management/ManualEnrollmentForm.jsx",
  "src/pages/admin/enrollment-management/EnrollmentManagement.jsx",
  "src/pages/admin/certification-management/ManualCertificationForm.jsx",
  "src/hooks/useRazorpay.js",
  "src/contexts/AuthContext.jsx",
  "src/components/UserAvatar.jsx",
  "src/components/Profile/ProfileForm.jsx",
  "src/components/Certification/CertificateGenerator.jsx"
];

for (const relPath of filesToUpdate) {
  const fullPath = path.join(__dirname, relPath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace displayName with username
    // Be careful with exact matches, using regex
    // We only want to replace `.displayName`, `{ displayName }`, `displayName:` etc.
    // Not React's `.displayName = '...'`
    
    // First, temporarily hide React display names
    content = content.replace(/\.displayName\s*=\s*['"]/g, '___REACT_DISPLAY_NAME___');
    
    // Replace property access and destructurings
    content = content.replace(/displayName/g, 'username');
    
    // Restore React display names
    content = content.replace(/___REACT_DISPLAY_NAME___/g, '.displayName = "');
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log("Updated", relPath);
  } else {
    console.log("File not found", relPath);
  }
}
