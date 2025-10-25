/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Alert, AlertDescription, AlertIcon } from '../ui/Alert';
import { useRealtime } from '../../contexts/RealtimeContext';
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Award,
  Calendar,
  PlayCircle
} from 'lucide-react';
import { cn } from '../../utils/cn';

const RealtimeUserDashboard = () => {
  const {
    enrollments,
    courses,
    userStats,
    enrollmentsLoading,
    enrollmentsError,
    isConnected,
    lastUpdated
  } = useRealtime();

  const [activeTab, setActiveTab] = useState('overview');

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

  const getEnrollmentWithCourse = (enrollment) => {
    const course = courses?.find(c => c.id === enrollment.courseId);
    return { ...enrollment, course };
  };

  const completedEnrollments = enrollments?.filter(e => e.progress?.completionPercentage >= 100) || [];
  const inProgressEnrollments = enrollments?.filter(e => e.progress?.completionPercentage > 0 && e.progress?.completionPercentage < 100) || [];
  const notStartedEnrollments = enrollments?.filter(e => e.progress?.completionPercentage === 0) || [];

  if (enrollmentsError) {
    return (
      <Alert variant="destructive">
        <AlertIcon variant="destructive" />
        <AlertDescription>
          Error loading your dashboard: {enrollmentsError}
        </AlertDescription>
      </Alert>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color = 'blue', subtitle }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn('h-4 w-4', `text-${color}-600`)} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
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
                Live Updates
              </>
            ) : (
              <>
                <Clock className="h-3 w-3 mr-1" />
                Offline
              </>
            )}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Last updated: {new Date(lastUpdated).toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Enrolled Courses"
          value={userStats?.enrolledCourses || 0}
          icon={BookOpen}
          color="blue"
          subtitle="Total enrollments"
        />
        <StatCard
          title="Completed Courses"
          value={userStats?.completedCourses || 0}
          icon={Award}
          color="green"
          subtitle="Certificates earned"
        />
        <StatCard
          title="In Progress"
          value={inProgressEnrollments.length}
          icon={PlayCircle}
          color="orange"
          subtitle="Currently learning"
        />
        <StatCard
          title="Total Spent"
          value={formatCurrency(userStats?.totalSpent || 0)}
          icon={TrendingUp}
          color="purple"
          subtitle="Investment in learning"
        />
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'in-progress', label: 'In Progress' },
          { id: 'completed', label: 'Completed' },
          { id: 'not-started', label: 'Not Started' }
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
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {enrollmentsLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : enrollments && enrollments.length > 0 ? (
                <div className="space-y-3">
                  {enrollments.slice(0, 5).map((enrollment) => {
                    const enrollmentWithCourse = getEnrollmentWithCourse(enrollment);
                    return (
                      <div key={enrollment.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">{enrollmentWithCourse.course?.title || enrollment.courseTitle}</p>
                          <p className="text-sm text-muted-foreground">
                            Enrolled: {formatDate(enrollment.enrolledAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={
                              enrollment.progress?.completionPercentage >= 100 ? 'success' :
                              enrollment.progress?.completionPercentage > 0 ? 'warning' : 'secondary'
                            }
                          >
                            {enrollment.progress?.completionPercentage || 0}%
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No enrollments yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* Learning Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Learning Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Completed</span>
                  <span className="text-sm text-muted-foreground">
                    {completedEnrollments.length} courses
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${enrollments.length > 0 ? (completedEnrollments.length / enrollments.length) * 100 : 0}%` 
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">In Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {inProgressEnrollments.length} courses
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${enrollments.length > 0 ? (inProgressEnrollments.length / enrollments.length) * 100 : 0}%` 
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Not Started</span>
                  <span className="text-sm text-muted-foreground">
                    {notStartedEnrollments.length} courses
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gray-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${enrollments.length > 0 ? (notStartedEnrollments.length / enrollments.length) * 100 : 0}%` 
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'in-progress' && (
        <Card>
          <CardHeader>
            <CardTitle>Courses In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            {inProgressEnrollments.length > 0 ? (
              <div className="space-y-4">
                {inProgressEnrollments.map((enrollment) => {
                  const enrollmentWithCourse = getEnrollmentWithCourse(enrollment);
                  return (
                    <div key={enrollment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{enrollmentWithCourse.course?.title || enrollment.courseTitle}</h4>
                        <p className="text-sm text-muted-foreground">
                          Last accessed: {formatDate(enrollment.progress?.lastAccessedAt)}
                        </p>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span>{enrollment.progress?.completionPercentage || 0}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mt-1">
                            <div 
                              className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${enrollment.progress?.completionPercentage || 0}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Button asChild>
                          <a href={`/learn/${enrollment.courseId}`}>
                            Continue Learning
                          </a>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No courses in progress
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'completed' && (
        <Card>
          <CardHeader>
            <CardTitle>Completed Courses</CardTitle>
          </CardHeader>
          <CardContent>
            {completedEnrollments.length > 0 ? (
              <div className="space-y-4">
                {completedEnrollments.map((enrollment) => {
                  const enrollmentWithCourse = getEnrollmentWithCourse(enrollment);
                  return (
                    <div key={enrollment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{enrollmentWithCourse.course?.title || enrollment.courseTitle}</h4>
                        <p className="text-sm text-muted-foreground">
                          Completed: {formatDate(enrollment.progress?.completedAt || enrollment.enrolledAt)}
                        </p>
                        <div className="mt-2">
                          <Badge variant="success">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            100% Complete
                          </Badge>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Button variant="outline" asChild>
                          <a href={`/course/${enrollment.courseId}`}>
                            View Certificate
                          </a>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No completed courses yet
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'not-started' && (
        <Card>
          <CardHeader>
            <CardTitle>Courses Not Started</CardTitle>
          </CardHeader>
          <CardContent>
            {notStartedEnrollments.length > 0 ? (
              <div className="space-y-4">
                {notStartedEnrollments.map((enrollment) => {
                  const enrollmentWithCourse = getEnrollmentWithCourse(enrollment);
                  return (
                    <div key={enrollment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{enrollmentWithCourse.course?.title || enrollment.courseTitle}</h4>
                        <p className="text-sm text-muted-foreground">
                          Enrolled: {formatDate(enrollment.enrolledAt)}
                        </p>
                        <div className="mt-2">
                          <Badge variant="secondary">Not Started</Badge>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Button asChild>
                          <a href={`/learn/${enrollment.courseId}`}>
                            Start Learning
                          </a>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                All enrolled courses have been started
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RealtimeUserDashboard;