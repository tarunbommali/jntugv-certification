import "react";
import { useParams } from "react-router-dom";
import { global_classnames } from "../utils/classnames.js";
import Breadcrumbs from "../components/ui/breadcrumbs/Breadcrumbs.jsx";

// ---------------- Legal Content ----------------
const legalContent = {
  "privacy-policy": {
    title: "Privacy Policy – NxtGen Certification (Powered by JNTU GV)",
    text: `
    This Privacy Policy explains how NxtGen Certification collects, uses, and protects your personal information when you use our website and services. 
    We may collect information such as your name, email, phone number, payment details, and usage data. This information is used to provide course access, 
    send updates, process secure payments, and improve our services. Your data is stored securely and will never be sold or shared with unauthorized 
    third parties. Cookies may be used to enhance your browsing experience. Some services, such as payments, may be handled by trusted third-party providers. 
    You have the right to request access, correction, or deletion of your data at any time. For privacy-related questions, you can reach us at 
    support@nxtgencert.com.
    `
  },
  "terms-of-service": {
    title: "Terms & Conditions – NxtGen Certification (Powered by JNTU GV)",
    text: `
    By accessing or using the NxtGen Certification website, you agree to these Terms & Conditions. You must use our services only for lawful purposes and 
    avoid sharing your login credentials with others. Enrollment and course access are provided after successful registration and payment. Fees once paid 
    may be non-refundable unless otherwise stated. All course materials and content are the intellectual property of NxtGen Certification and JNTU GV 
    and may not be copied or redistributed without permission. We strive to provide accurate content but are not liable for any damages or losses resulting 
    from use of the platform. Accounts violating these terms may be suspended or terminated. These terms are governed by the laws of India and may be 
    updated at any time. For questions regarding these Terms, please contact us at support@nxtgencert.com.
    `
  }
};
// -------------------------------------------------

const LegalPage = () => {
  const { page } = useParams(); // "privacy-policy" or "terms-of-service"

  const content = legalContent[page];

  const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: content ? content.title.split("–")[0].trim() : "Not Found", link: `/legal/${page}` }
  ];

  if (!content) {
    return (
      <div className={`${global_classnames.width.container} min-h-screen p-6`}>
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
        <p>The legal page you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className={`${global_classnames.width.container} min-h-screen p-6`}>
      <Breadcrumbs items={breadcrumbItems} />
      <h1 className="text-2xl font-bold mb-6">{content.title}</h1>
      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
        {content.text}
      </p>
    </div>
  );
};

export default LegalPage;
