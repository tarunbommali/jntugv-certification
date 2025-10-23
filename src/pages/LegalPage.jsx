/* eslint-disable no-unused-vars */
import React from "react";
import { useParams, Link } from "react-router-dom";
import { global_classnames } from "../utils/classnames.js";
import PageTitle from "../components/ui/PageTitle.jsx";
import PageContainer from "../components/layout/PageContainer.jsx";

const legalContent = {
  "privacy-policy": {
    title: "Privacy Policy",
    description: "Learn how JNTU-GV (NxtGen Certification) collects, uses, and protects your personal information.",
    lastUpdated: "October 1, 2025",
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
    title: "Terms & Conditions",
    description: "Read the Terms & Conditions for using JNTU-GV (NxtGen Certification) services and website.",
    lastUpdated: "October 1, 2025",
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
  const { page } = useParams();
  const content = legalContent[page];

  // Breadcrumb items without "Legal" in the middle
  const getBreadcrumbItems = () => {
    if (!content) {
      return [
        { label: "Home", link: "/" },
        { label: "Page Not Found", link: null }
      ];
    }

    return [
      { label: "Home", link: "/" },
      { label: content.title, link: null }
    ];
  };

  const items = getBreadcrumbItems();

  if (!content) {
    return (
      <PageContainer
        items={items}
        className={`${global_classnames.width.container} min-h-screen p-6`}
      >
        <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
        <p>The legal page you are looking for does not exist.</p>
        <p className="mt-4">
          <Link to="/">Return home</Link>
        </p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      items={items}
      className={`${global_classnames.width.container} min-h-screen p-6`}
    >
      <PageTitle title={content.title} description={content.description} />
      <p className="text-gray-600 mb-2">Last updated: {content.lastUpdated}</p>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: content.body }}
      />
    </PageContainer>
  );
};

export default LegalPage;