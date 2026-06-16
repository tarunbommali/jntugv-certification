/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext.jsx';
import { apiRequest } from '../../../api/client.js';
import {
  CheckCircle,
  FileText,
  User,
  BookOpen,
  Loader2,
  Clock,
  Award,
  Search,
  Filter
} from 'lucide-react';
import PageContainer from '../../../components/layout/PageContainer.jsx';
import PageTitle from '../../../components/ui/PageTitle.jsx';

const breadcrumbItems = [
  { label: "Admin", link: "/admin" },
  { label: "Certification Management", link: "/admin/certifications" },
];

const CertificationManagement = () => {
  const { isAuthenticated, userProfile, isAdmin } = useAuth();
  const [pendingCertifications, setPendingCertifications] = useState([]);
  const [issuedCertifications, setIssuedCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCertifications = async () => {
    try {
      setLoading(true);
      // Fetch both pending and issued certifications
      const [pendingData, issuedData] = await Promise.all([
        apiRequest('/admin/certifications?status=PENDING'),
        apiRequest('/admin/certifications?status=ISSUED')
      ]);
      setPendingCertifications(pendingData || []);
      setIssuedCertifications(issuedData || []);
    } catch (error) {
      console.error("Failed to fetch certifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchCertifications();
    }
  }, [isAuthenticated, isAdmin]);

  const handleIssue = async (certId) => {
    try {
      setActionLoading(certId);
      await apiRequest(`/admin/certifications/${certId}`, {
        method: 'PUT',
        body: {
          status: 'ISSUED',
          issuedAt: new Date().toISOString(),
          issuedBy: userProfile?.id
        }
      });
      // Refresh list
      fetchCertifications();
    } catch (error) {
      console.error("Failed to issue certificate", error);
      alert("Failed to issue certificate");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'ISSUED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Issued
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-elevated text-foreground">
            {status || 'Unknown'}
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const filterCertifications = (certs) => {
    if (!searchTerm.trim()) return certs;
    const search = searchTerm.toLowerCase();
    return certs.filter(cert =>
      (cert.metadata?.userName || '').toLowerCase().includes(search) ||
      (cert.metadata?.courseTitle || '').toLowerCase().includes(search) ||
      (cert.userId || '').toLowerCase().includes(search) ||
      (cert.courseId || '').toLowerCase().includes(search)
    );
  };

  const currentCertifications = activeTab === 'pending'
    ? filterCertifications(pendingCertifications)
    : filterCertifications(issuedCertifications);

  if (loading) {
    return (
      <PageContainer items={breadcrumbItems} className="min-h-screen bg-background py-8">
        <div className="flex justify-center items-center p-16">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer items={breadcrumbItems} className="min-h-screen bg-background py-8">
      <PageTitle
        title="Certification Management"
        description="Review and issue certificates to students who have completed their courses"
      />

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-surface p-4 rounded-lg shadow border border-border text-center">
          <div className="text-3xl font-bold text-yellow-600">{pendingCertifications.length}</div>
          <div className="text-sm text-muted flex items-center justify-center gap-1">
            <Clock className="w-4 h-4" />
            Pending Review
          </div>
        </div>
        <div className="bg-surface p-4 rounded-lg shadow border border-border text-center">
          <div className="text-3xl font-bold text-green-600">{issuedCertifications.length}</div>
          <div className="text-sm text-muted flex items-center justify-center gap-1">
            <CheckCircle className="w-4 h-4" />
            Issued
          </div>
        </div>
        <div className="bg-surface p-4 rounded-lg shadow border border-border text-center">
          <div className="text-3xl font-bold text-blue-600">{pendingCertifications.length + issuedCertifications.length}</div>
          <div className="text-sm text-muted flex items-center justify-center gap-1">
            <Award className="w-4 h-4" />
            Total Certificates
          </div>
        </div>
      </div>

      {/* Search and Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="w-5 h-5 text-muted absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by user or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'pending'
                ? 'bg-yellow-500 text-white'
                : 'bg-surface text-muted hover:bg-background'
              }`}
          >
            <Clock className="w-4 h-4 inline mr-1" />
            Pending ({pendingCertifications.length})
          </button>
          <button
            onClick={() => setActiveTab('issued')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'issued'
                ? 'bg-green-500 text-white'
                : 'bg-surface text-muted hover:bg-background'
              }`}
          >
            <CheckCircle className="w-4 h-4 inline mr-1" />
            Issued ({issuedCertifications.length})
          </button>
        </div>
      </div>

      {/* Certifications Table */}
      <div className="bg-surface rounded-xl shadow-md border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-background">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  {activeTab === 'pending' ? 'Requested' : 'Issued Date'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  Certificate ID
                </th>
                {activeTab === 'pending' && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-border">
              {currentCertifications.length > 0 ? (
                currentCertifications.map((cert) => (
                  <tr key={cert.id} className="hover:bg-background transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-foreground">
                            {cert.metadata?.userName || 'Unknown User'}
                          </div>
                          <div className="text-sm text-muted">
                            {cert.userId?.substring(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <BookOpen className="w-4 h-4 text-muted" />
                        <span>{cert.metadata?.courseTitle || cert.courseId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-surface-elevated rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${cert.completionPercentage || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-muted">
                          {cert.completionPercentage || 0}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(cert.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                      {formatDate(activeTab === 'pending' ? cert.createdAt : cert.issuedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-mono bg-surface-elevated px-2 py-1 rounded text-muted">
                        {cert.id?.substring(0, 8)}...
                      </span>
                    </td>
                    {activeTab === 'pending' && (
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleIssue(cert.id)}
                          disabled={actionLoading === cert.id}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionLoading === cert.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          Issue Certificate
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={activeTab === 'pending' ? 7 : 6} className="px-6 py-12 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-muted">
                      {activeTab === 'pending'
                        ? 'No pending certifications found.'
                        : 'No issued certifications found.'}
                    </p>
                    {searchTerm && (
                      <p className="text-sm text-muted mt-1">
                        Try adjusting your search terms.
                      </p>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
};

export default CertificationManagement;