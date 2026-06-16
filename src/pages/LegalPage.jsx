/* eslint-disable no-unused-vars */
import React from "react";
import { useParams, Link } from "react-router-dom";
import { global_classnames } from "../utils/classnames.js";
import PageTitle from "../components/ui/PageTitle.jsx";
import PageContainer from "../components/layout/PageContainer.jsx";
import {privacyPolicy, termsOfService} from "../data/legal/legalContent.js";

const legalContent = {
  "privacy-policy": privacyPolicy,
  "terms-of-service": termsOfService,
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
      <p className="text-muted mb-2">Last updated: {content.lastUpdated}</p>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: content.body }}
      />
    </PageContainer>
  );
};

export default LegalPage;