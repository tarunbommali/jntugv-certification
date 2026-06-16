/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import React, { useMemo, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Download, Printer, Share2 } from 'lucide-react';
import CertificateTemplate from './CertificateTemplate';
import {
  downloadCertificationPdf,
  buildCertificateTemplateData,
} from '../../utils/helper/certificatePdf.js';

const CertificateGenerator = ({ 
  certification,
  studentProfile,
  onClose 
}) => {
  const certificateRef = useRef();

  const resolvedCertification = useMemo(() => {
    const certificateId = certification.certificateId || certification.id || certification.referenceId;

    return {
      ...certification,
      certificateId,
      user: {
        ...(certification.user || {}),
        username: studentProfile?.fullName
          || certification.user?.username
          || certification.studentName
          || certification.user?.email
          || 'Student',
        email: certification.user?.email || studentProfile?.email,
      },
      course: {
        ...(certification.course || {}),
        title: certification.course?.title || certification.courseTitle,
        instructor: certification.course?.instructor,
        duration: certification.course?.duration,
        mode: certification.course?.mode,
      },
      duration: certification.duration || 'Self-paced',
      instructor: certification.instructor || certification.course?.instructor,
      mode: certification.mode || certification.course?.mode || 'Online',
      issuedAt: certification.issuedAt || certification.issueDate,
      completedAt: certification.completedDate || certification.completedAt,
      grade: certification.grade,
    };
  }, [certification, studentProfile]);

  const templateData = useMemo(
    () => buildCertificateTemplateData(resolvedCertification),
    [resolvedCertification]
  );

  const handlePrint = useReactToPrint({
    content: () => certificateRef.current,
    documentTitle: `${certification.courseTitle} - Certificate`,
    onAfterPrint: () => console.log('Printed successfully')
  });

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) {
      window.alert('Certificate preview not ready. Please try again.');
      return;
    }

    try {
      await downloadCertificationPdf(resolvedCertification, {
        element: certificateRef.current,
      });
    } catch (error) {
      window.alert(error?.message || 'Failed to download certificate');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My Certificate - ${templateData.courseTitle}`,
          text: `I completed ${templateData.courseTitle} from Aikya I/O!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Sharing cancelled', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Certificate link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 bg-background bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Your Certificate</h2>
            <p className="text-muted">Congratulations on completing {certification.courseTitle}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Certificate Preview */}
        <div className="p-6 bg-surface-elevated">
          <div ref={certificateRef} className="bg-surface shadow-lg">
            <CertificateTemplate {...templateData} />
          </div>
        </div>

        {/* Verification Info */}
        <div className="p-6 border-t border-border bg-background">
          <h3 className="font-semibold text-foreground mb-2">Certificate Verification</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Certificate ID:</strong> {templateData.certificateId}</p>
              <p><strong>Issue Date:</strong> {templateData.issueDate}</p>
              <p><strong>Student ID:</strong> {studentProfile.studentId || 'N/A'}</p>
            </div>
            <div>
              <p><strong>Verification URL:</strong></p>
              <p className="text-blue-600 break-all">
                https://aikya.io/verify/{templateData.certificateId}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateGenerator;