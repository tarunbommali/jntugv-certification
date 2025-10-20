/* eslint-disable no-unused-vars */
import React from "react";
import { useParams, Link } from "react-router-dom";
import { global_classnames } from "../utils/classnames.js";

// Minimal legal content mapping for /legal/:page
const legalContent = {
  "privacy-policy": {
    title: "Privacy Policy — JNTU-GV Certification",
    body: `
      <p>
        This Privacy Policy explains how JNTU-GV (NxtGen Certification) collects, uses, and protects your personal information when you use our website and services.
      </p>
      <p>
        We may collect information such as your name, email, phone number, payment details, and usage data. This information is used to provide course access, send updates, process secure payments, and improve our services.
      </p>
    `,
  },
  "terms-of-service": {
    title: "Terms & Conditions — JNTU-GV Certification",
    body: `
      <p>
        By accessing or using the JNTU-GV certification website, you agree to these Terms & Conditions. Use the services only for lawful purposes and do not share credentials.
      </p>
      <p>
        Enrollment and course access are provided after successful registration and payment. Fees may be non-refundable unless otherwise stated.
      </p>
    `,
  },
};

const LegalPage = () => {
  const { page } = useParams(); // "privacy-policy" or "terms-of-service"

  const content = legalContent[page];

  if (!content) {
    return (
      <div className={`${global_classnames.width.container} min-h-screen p-6`}>
        <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
        <p>The legal page you are looking for does not exist.</p>
        <p className="mt-4">
          <Link to="/">Return home</Link>
        </p>
      </div>
    );
  }

  return (
    <div className={`${global_classnames.width.container} min-h-screen p-6`}>
      <h1 className="text-2xl font-bold mb-4">{content.title}</h1>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content.body }} />
    </div>
  );
};

export default LegalPage;