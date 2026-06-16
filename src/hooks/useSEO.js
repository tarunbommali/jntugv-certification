import { useEffect } from 'react';

/**
 * useSEO — Lightweight SEO hook.
 * Sets document.title, meta tags, canonical, OG, Twitter cards, and JSON-LD.
 * Zero external dependencies — uses native DOM manipulation.
 *
 * @param {Object} options
 * @param {string} options.title        - Page title (appended with "| Aikya I/O")
 * @param {string} [options.description] - Meta description
 * @param {string} [options.canonical]   - Canonical URL
 * @param {string} [options.ogImage]     - OG image URL
 * @param {Object} [options.jsonLd]      - JSON-LD structured data object
 * @param {boolean} [options.noIndex]    - Set noindex on page
 */
const useSEO = ({
  title,
  description,
  canonical,
  ogImage = '/og-image.png',
  jsonLd,
  noIndex = false,
} = {}) => {
  useEffect(() => {
    const BRAND = 'Aikya I/O';
    const fullTitle = title ? `${title} | ${BRAND}` : `${BRAND} | AI Learning Marketplace`;
    const metaDescription =
      description ||
      'Create, learn, practice, and earn certifications with AI-powered courses, quizzes, flashcards, and interactive learning experiences.';
    const canonicalUrl = canonical || window.location.href;

    // --- Document Title ---
    document.title = fullTitle;

    // --- Helper: upsert a <meta> tag ---
    const setMeta = (selector, attr, value) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        const [attrName, attrValue] = selector.replace(/\[|\]/g, '').split('=');
        el.setAttribute(attrName, attrValue?.replace(/"/g, '') || attr);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    // --- Helper: upsert a <link> tag ---
    const setLink = (rel, href) => {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // Standard meta
    setMeta('meta[name="description"]', 'content', metaDescription);
    setMeta(
      'meta[name="robots"]',
      'content',
      noIndex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large'
    );

    // Canonical
    setLink('canonical', canonicalUrl);

    // Open Graph
    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[property="og:description"]', 'content', metaDescription);
    setMeta('meta[property="og:image"]', 'content', ogImage);
    setMeta('meta[property="og:url"]', 'content', canonicalUrl);
    setMeta('meta[property="og:type"]', 'content', 'website');
    setMeta('meta[property="og:site_name"]', 'content', BRAND);

    // Twitter Cards
    setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'content', fullTitle);
    setMeta('meta[name="twitter:description"]', 'content', metaDescription);
    setMeta('meta[name="twitter:image"]', 'content', ogImage);

    // JSON-LD Structured Data
    const JSONLD_ID = 'aikya-jsonld';
    let script = document.getElementById(JSONLD_ID);
    if (jsonLd) {
      if (!script) {
        script = document.createElement('script');
        script.id = JSONLD_ID;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    } else if (script) {
      script.remove();
    }

    // Cleanup: restore title on unmount
    return () => {
      document.title = `${BRAND} | AI Learning Marketplace`;
    };
  }, [title, description, canonical, ogImage, jsonLd, noIndex]);
};

export default useSEO;
