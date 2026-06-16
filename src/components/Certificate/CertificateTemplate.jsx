/* eslint-disable no-unused-vars */
import React from 'react';

const CertificateTemplate = ({
    studentName,
    courseTitle,
    certificateId,
    issueDate,
    instructor = "Aikya I/O"
}) => {
    // Use inline styles for critical layout to ensure html2canvas compatibility
    const containerStyle = {
        width: '800px',
        height: '600px',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: '8px double #e5e7eb',
        padding: '40px',
        fontFamily: 'Georgia, serif',
        position: 'relative',
        boxSizing: 'border-box',
    };

    const cornerStyle = {
        position: 'absolute',
        width: '60px',
        height: '60px',
        borderColor: '#ca8a04',
        borderStyle: 'solid',
        opacity: 0.6,
    };

    return (
        <div style={containerStyle}>
            {/* Corner decorations */}
            <div style={{ ...cornerStyle, top: '16px', left: '16px', borderWidth: '4px 0 0 4px', borderRadius: '20px 0 0 0' }}></div>
            <div style={{ ...cornerStyle, top: '16px', right: '16px', borderWidth: '4px 4px 0 0', borderRadius: '0 20px 0 0' }}></div>
            <div style={{ ...cornerStyle, bottom: '16px', left: '16px', borderWidth: '0 0 4px 4px', borderRadius: '0 0 0 20px' }}></div>
            <div style={{ ...cornerStyle, bottom: '16px', right: '16px', borderWidth: '0 4px 4px 0', borderRadius: '0 0 20px 0' }}></div>

            <div style={{
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '20px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e5e7eb',
            }}>
                {/* Header */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        marginBottom: '12px',
                        backgroundColor: '#1e3a5f',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        fontFamily: 'Arial, sans-serif',
                    }}>
                        A
                    </div>
                    <h1 style={{
                        fontSize: '36px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        letterSpacing: '6px',
                        color: '#1e3a5f',
                        margin: '0 0 8px 0',
                    }}>
                        Certificate
                    </h1>
                    <span style={{
                        fontSize: '16px',
                        color: '#ca8a04',
                        fontWeight: '600',
                        letterSpacing: '3px',
                        textTransform: 'uppercase',
                    }}>
                        Of Completion
                    </span>
                </div>

                {/* Body */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                    <p style={{ fontSize: '16px', fontStyle: 'italic', color: '#6b7280', margin: 0 }}>
                        This certificate is proudly presented to
                    </p>

                    <h2 style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: '#1f2937',
                        borderBottom: '2px solid #d1d5db',
                        paddingBottom: '8px',
                        margin: '8px 0',
                        minWidth: '300px',
                    }}>
                        {studentName || "Student Name"}
                    </h2>

                    <p style={{ fontSize: '14px', color: '#6b7280', maxWidth: '500px', lineHeight: 1.5, margin: 0 }}>
                        For successfully completing all the requirements of the course:
                    </p>

                    <h3 style={{
                        fontSize: '22px',
                        fontWeight: 'bold',
                        color: '#1e40af',
                        margin: '8px 0',
                    }}>
                        {courseTitle || "Course Title"}
                    </h3>

                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
                        Issued on {issueDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 20px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '140px',
                            borderBottom: '1px solid #9ca3af',
                            marginBottom: '8px',
                            paddingBottom: '8px',
                            fontSize: '16px',
                            color: '#1e3a5f',
                        }}>
                            {instructor}
                        </div>
                        <p style={{ fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '1px', margin: 0 }}>
                            Authorized Signature
                        </p>
                    </div>

                    {/* Seal */}
                    <div style={{
                        width: '70px',
                        height: '70px',
                        backgroundColor: '#fef9c3',
                        borderRadius: '50%',
                        border: '3px solid #ca8a04',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#a16207',
                        fontWeight: 'bold',
                        fontSize: '8px',
                        textTransform: 'uppercase',
                        textAlign: 'center',
                        padding: '8px',
                    }}>
                        Verified Certification
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '140px', borderBottom: '1px solid #9ca3af', marginBottom: '8px' }}></div>
                        <p style={{ fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '1px', margin: 0 }}>
                            Date
                        </p>
                        <p style={{ fontSize: '12px', fontWeight: '500', margin: '4px 0 0 0' }}>
                            {issueDate || new Date().toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Certificate ID */}
                <div style={{ marginTop: '16px', fontSize: '10px', color: '#9ca3af' }}>
                    Certificate ID: {certificateId || "PENDING"}
                </div>
            </div>
        </div>
    );
};

export default CertificateTemplate;
