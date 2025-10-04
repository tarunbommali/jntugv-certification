import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Alert, AlertDescription, AlertIcon } from '../ui/Alert';
import { useRealtime } from '../../contexts/RealtimeContext';
import { 
  Users, 
  BookOpen, 
  CreditCard, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { cn } from '../../utils/cn';

const RealtimeDashboard = () => {
  const {
    adminStats,
    adminEnrollments,
    adminPayments,
    courses,
    coupons,
    coursesLoading,
    adminEnrollmentsLoading,
    adminPaymentsLoading,
    coursesError,
    adminEnrollmentsError,
    adminPaymentsError,
    isConnected,
    lastUpdated,
    getRecentEnrollments,
    getRecentPayments,
    getActiveCoupons
  } = useRealtime();

  const [activeTab, setActiveTab] = useState('overview');

  if (coursesError || adminEnrollmentsError || adminPaymentsError) {
    return (
      <Alert variant="destructive">
        <AlertIcon variant="destructive" />
        <AlertDescription>
          Error loading dashboard data. Please check your connection and try again.
        </AlertDescription>
      </Alert>
    );
  }

  const recentEnrollments = getRecentEnrollments(5);
  const recentPayments = getRecentPayments(5);
  const activeCoupons = getActiveCoupons();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount / 100);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp.toDate ? timestamp.toDate() : timestamp).toLocaleDateString();
  };

  const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn('h-4 w-4', `text-${color}-600`)} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? 'success' : 'destructive'}>
            {isConnected ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3 mr-1" />
                Disconnected
              </>
            )}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Last updated: {new Date(lastUpdated).toLocaleTimeString()}
          </span>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={adminStats?.totalUsers || 0}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Total Courses"
          value={adminStats?.totalCourses || 0}
          icon={BookOpen}
          color="green"
        />
        <StatCard
          title="Total Enrollments"
          value={adminStats?.totalEnrollments || 0}
          icon={TrendingUp}
          color="purple"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(adminStats?.totalRevenue || 0)}
          icon={CreditCard}
          color="orange"
        />
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'enrollments', label: 'Recent Enrollments' },
          { id: 'payments', label: 'Recent Payments' },
          { id: 'coupons', label: 'Active Coupons' }
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(tab.id)}
            className="flex-1"
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Enrollments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Enrollments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {adminEnrollmentsLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : recentEnrollments.length > 0 ? (
                <div className="space-y-3">
                  {recentEnrollments.map((enrollment) => (
                    <div key={enrollment.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{enrollment.courseTitle}</p>
                        <p className="text-sm text-muted-foreground">
                          {enrollment.userId}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="success">{enrollment.status}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(enrollment.enrolledAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No recent enrollments
                </p>
              )}
            </CardContent>
          </Card>

          {/* Recent Payments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Recent Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {adminPaymentsLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : recentPayments.length > 0 ? (
                <div className="space-y-3">
                  {recentPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{payment.courseTitle}</p>
                        <p className="text-sm text-muted-foreground">
                          {payment.userId}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(payment.amount)}</p>
                        <Badge 
                          variant={payment.status === 'captured' ? 'success' : 'secondary'}
                        >
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No recent payments
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'enrollments' && (
        <Card>
          <CardHeader>
            <CardTitle>All Recent Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            {adminEnrollmentsLoading ? (
              <div className="text-center py-8">Loading enrollments...</div>
            ) : adminEnrollments.length > 0 ? (
              <div className="space-y-3">
                {adminEnrollments.map((enrollment) => (
                  <div key={enrollment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{enrollment.courseTitle}</h4>
                      <p className="text-sm text-muted-foreground">
                        User: {enrollment.userId}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Enrolled: {formatDate(enrollment.enrolledAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="success">{enrollment.status}</Badge>
                      <p className="text-sm font-medium mt-1">
                        {formatCurrency(enrollment.amount || 0)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No enrollments found
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'payments' && (
        <Card>
          <CardHeader>
            <CardTitle>All Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            {adminPaymentsLoading ? (
              <div className="text-center py-8">Loading payments...</div>
            ) : adminPayments.length > 0 ? (
              <div className="space-y-3">
                {adminPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{payment.courseTitle}</h4>
                      <p className="text-sm text-muted-foreground">
                        User: {payment.userId}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Payment ID: {payment.paymentId}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{formatCurrency(payment.amount)}</p>
                      <Badge 
                        variant={payment.status === 'captured' ? 'success' : 'secondary'}
                      >
                        {payment.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatDate(payment.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No payments found
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'coupons' && (
        <Card>
          <CardHeader>
            <CardTitle>Active Coupons</CardTitle>
          </CardHeader>
          <CardContent>
            {couponsLoading ? (
              <div className="text-center py-8">Loading coupons...</div>
            ) : activeCoupons.length > 0 ? (
              <div className="space-y-3">
                {activeCoupons.map((coupon) => (
                  <div key={coupon.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{coupon.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Code: {coupon.code}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {coupon.type === 'percent' ? `${coupon.value}%` : formatCurrency(coupon.value)} discount
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="success">Active</Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        Used: {coupon.usedCount}/{coupon.usageLimit || '∞'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Valid until: {formatDate(coupon.validUntil)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No active coupons
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RealtimeDashboard;