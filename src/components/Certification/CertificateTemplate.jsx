/* eslint-disable no-unused-vars */
import React from 'react';

const CertificateTemplate = ({ 
  studentName, 
  courseTitle, 
  certificateId, 
  issueDate, 
  completionDate,
  institution = "Aikya I/O",
  instructor = "Aikya I/O Instructor",
  duration = "Self-paced",
  grade = "Excellent",
  mode = "Online"
}) => {
  return (
    <div className="certificate-container relative w-full max-w-4xl mx-auto bg-surface border-8 border-gold-500 shadow-2xl overflow-hidden">
      {/* Certificate Header */}
      <div className="certificate-header bg-blue-900 text-white py-6 text-center">
        <div className="institution-logo mb-4">
          <div className="w-20 h-20 mx-auto bg-surface rounded-full flex items-center justify-center border-4 border-gold-500">
            <span className="text-blue-900 font-bold text-lg">Aikya</span>
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-wider">CERTIFICATE</h1>
        <p className="text-xl mt-2 font-light">OF ACHIEVEMENT</p>
      </div>

      {/* Certificate Body */}
      <div className="certificate-body py-12 px-8 text-center">
        {/* This is to certify that */}
        <div className="intro-text mb-8">
          <p className="text-lg text-muted mb-2">This is to certify that</p>
        </div>

        {/* Student Name */}
        <div className="student-name mb-8">
          <h2 className="text-5xl font-bold text-blue-900 border-b-4 border-gold-500 pb-4 inline-block px-8">
            {studentName}
          </h2>
        </div>

        {/* Achievement Text */}
        <div className="achievement-text mb-8">
          <p className="text-lg text-muted leading-relaxed max-w-3xl mx-auto">
            has successfully completed the course on
          </p>
          <h3 className="text-3xl font-semibold text-blue-800 mt-4 mb-6">
            "{courseTitle}"
          </h3>
          <p className="text-lg text-muted">
            with a grade of <span className="font-bold text-green-700">{grade}</span>
          </p>
        </div>

        {/* Course Details */}
        <div className="course-details grid grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
          <div className="detail-item text-left">
            <p className="text-sm text-muted">Duration</p>
            <p className="font-semibold">{duration}</p>
          </div>
          <div className="detail-item text-left">
            <p className="text-sm text-muted">Mode</p>
            <p className="font-semibold">{mode}</p>
          </div>
          <div className="detail-item text-left">
            <p className="text-sm text-muted">Instructor</p>
            <p className="font-semibold">{instructor}</p>
          </div>
          <div className="detail-item text-left">
            <p className="text-sm text-muted">Completion Date</p>
            <p className="font-semibold">{completionDate}</p>
          </div>
        </div>

        {/* Certificate ID */}
        <div className="certificate-id mb-8">
          <p className="text-sm text-muted">Certificate ID</p>
          <p className="font-mono text-lg font-bold text-blue-900">{certificateId}</p>
        </div>
      </div>

      {/* Certificate Footer */}
      <div className="certificate-footer border-t-2 border-border pt-6 pb-8 px-8">
        <div className="grid grid-cols-3 gap-8 items-end">
          {/* Issued By */}
          <div className="text-center">
            <div className="signature-line border-t-2 border-gray-400 w-32 mx-auto mb-2"></div>
            <p className="font-semibold text-blue-900">Dr. K. V. N. Sunitha</p>
            <p className="text-sm text-muted">Director</p>
            <p className="text-sm text-muted">Aikya I/O</p>
          </div>

          {/* Seal */}
          <div className="text-center">
            <div className="seal w-24 h-24 mx-auto border-4 border-red-600 rounded-full flex items-center justify-center bg-surface">
              <div className="text-center">
                <span className="block text-xs font-bold text-red-600">OFFICIAL</span>
                <span className="block text-xs font-bold text-red-600">SEAL</span>
              </div>
            </div>
            <p className="text-xs text-muted mt-2">Verification Seal</p>
          </div>

          {/* Date */}
          <div className="text-center">
            <div className="signature-line border-t-2 border-gray-400 w-32 mx-auto mb-2"></div>
            <p className="font-semibold text-blue-900">Date of Issue</p>
            <p className="text-sm text-muted">{issueDate}</p>
          </div>
        </div>

        {/* Verification Note */}
        <div className="text-center mt-6 pt-4 border-t border-border">
          <p className="text-xs text-muted">
            Verify this certificate at: https://aikya.io/verify/{certificateId}
          </p>
        </div>
      </div>

      {/* Watermark Background */}
      <div className="watermark absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-blue-200 text-9xl font-bold transform rotate-45">
            AIKYA
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplate;