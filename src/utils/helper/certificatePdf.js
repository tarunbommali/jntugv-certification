import { createElement } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { renderToStaticMarkup } from "react-dom/server";
import CertificateTemplate from "../../components/Certification/CertificateTemplate.jsx";

const sanitizeFileName = (value) => {
  if (!value) return "certificate";
  return String(value)
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-_]/g, "")
    .slice(0, 120)
    || "certificate";
};

const formatLongDate = (value) => {
  if (!value) return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const dateValue = value.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(dateValue?.getTime?.())) {
    return new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return dateValue.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const scoreToGrade = (score) => {
  const numericScore = Number.parseFloat(score ?? 0);
  if (Number.isNaN(numericScore)) return "Satisfactory";
  if (numericScore >= 90) return "Excellent";
  if (numericScore >= 75) return "Very Good";
  if (numericScore >= 60) return "Good";
  return "Satisfactory";
};

export const buildCertificateTemplateData = (certification = {}) => {
  const certificateId = certification.certificateId || certification.id || "CERTIFICATE";
  const courseTitle = certification.course?.title
    || certification.courseTitle
    || certification.metadata?.courseTitle
    || "Course Title";

  const studentName = certification.user?.username
    || certification.user?.fullName
    || certification.user?.email
    || certification.recipientName
    || "Student Name";

  const completionDate = certification.completedAt
    || certification.completionDate
    || certification.taskProgress?.completedAt
    || certification.issuedAt
    || new Date();

  const issueDate = certification.issuedAt || new Date();

  return {
    studentName,
    courseTitle,
    certificateId,
    issueDate: formatLongDate(issueDate),
    completionDate: formatLongDate(completionDate),
    institution: certification.institution || "Aikya I/O",
    instructor: certification.course?.instructor || certification.instructor || "Aikya I/O Instructor",
    duration: certification.course?.duration
      ? `${certification.course.duration} hours`
      : certification.duration || "Self-paced",
    grade: certification.grade || scoreToGrade(certification.overallScore),
    mode: certification.course?.mode || certification.mode || "Online",
  };
};

export const downloadCertificationPdf = async (certification, options = {}) => {
  const { element = null, templateData } = options;

  let targetElement = element;
  let cleanup = null;

  if (!targetElement) {
    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.left = "-10000px";
    wrapper.style.top = "0";
    wrapper.style.padding = "24px";
    wrapper.style.backgroundColor = "#ffffff";
    wrapper.style.width = "1200px";
    wrapper.style.zIndex = "-1";

  const data = templateData || buildCertificateTemplateData(certification);
  wrapper.innerHTML = renderToStaticMarkup(createElement(CertificateTemplate, data));

    document.body.appendChild(wrapper);
    targetElement = wrapper.querySelector(".certificate-container") || wrapper;

    cleanup = () => {
      document.body.removeChild(wrapper);
    };
  }

  if (!targetElement) {
    throw new Error("Unable to prepare certificate layout for download");
  }

  try {
    if (document.fonts?.ready) {
      try {
        await document.fonts.ready;
      } catch {
        // Ignore font loading issues and continue with available fonts
      }
    }

    await new Promise((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(resolve);
      });
    });

    const canvas = await html2canvas(targetElement, {
      scale: window.devicePixelRatio > 1 ? 2 : 1.5,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      scrollX: 0,
      scrollY: 0,
    });

    const imgData = canvas.toDataURL("image/png");
    const orientation = canvas.width >= canvas.height ? "landscape" : "portrait";
    const pdf = new jsPDF({
      orientation,
      unit: "pt",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

    const fileName = `${sanitizeFileName(
      options.fileName || certification.certificateId || certification.id || "certificate",
    )}.pdf`;

    pdf.save(fileName);
  } finally {
    if (typeof cleanup === "function") {
      cleanup();
    }
  }
};

export default downloadCertificationPdf;
