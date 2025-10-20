/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import FormField from '../ui/FormField';
import { Alert, AlertDescription, AlertIcon } from '../ui/Alert';
import CourseList from '../course/CourseList';
import { useRealtime } from '../../contexts/RealtimeContext';
import { useFormValidation, validationRules } from '../../hooks/useFormValidation';
import { 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '../../utils/cn';

const RealtimeCourseManagement = () => {
  const {
    courses,
    adminEnrollments,
    coursesLoading,
    adminEnrollmentsLoading,
    coursesError,
    updateCourse,
    createCourse,
    courseMutationsLoading,
    courseMutationsError
  } = useRealtime();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { values, errors, handleChange, handleBlur, validateForm, resetForm } = useFormValidation(
    {
      title: '',
      instructor: '',
      description: '',
      price: '',
      duration: '',
      category: '',
      difficulty: ''
    },
    {
      title: [validationRules.required('Course title is required')],
      instructor: [validationRules.required('Instructor name is required')],
      description: [
        validationRules.required('Description is required'),
        validationRules.minLength(20, 'Description must be at least 20 characters')
      ],
      price: [
        validationRules.required('Price is required'),
        validationRules.positiveNumber('Price must be a positive number')
      ],
      duration: [
        validationRules.required('Duration is required'),
        validationRules.positiveNumber('Duration must be a positive number')
      ],
      category: [validationRules.required('Please select a category')],
      difficulty: [validationRules.required('Please select difficulty level')]
    }
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount / 100);
  };

  const getCourseStats = (courseId) => {
    const enrollments = adminEnrollments?.filter(e => e.courseId === courseId) || [];
    const totalEnrollments = enrollments.length;
    const totalRevenue = enrollments.reduce((sum, e) => sum + (e.amount || 0), 0);
    const completionRate = enrollments.length > 0 
      ? enrollments.filter(e => e.progress?.completionPercentage >= 100).length / enrollments.length * 100
      : 0;

    return {
      totalEnrollments,
      totalRevenue,
      completionRate: Math.round(completionRate)
    };
  };

  const handleTogglePublish = async (courseId, currentStatus) => {
    const result = await updateCourse(courseId, {
      isPublished: !currentStatus,
      status: !currentStatus ? 'published' : 'draft'
    });

    if (result.success) {
      // Success feedback could be shown here
      console.log('Course status updated successfully');
    } else {
      console.error('Failed to update course status:', result.error);
    }
  };

  const handleToggleFeatured = async (courseId, currentStatus) => {
    const result = await updateCourse(courseId, {
      isFeatured: !currentStatus
    });

    if (result.success) {
      console.log('Course featured status updated successfully');
    } else {
      console.error('Failed to update course featured status:', result.error);
    }
  };

  if (coursesError) {
    return (
      <Alert variant="destructive">
        <AlertIcon variant="destructive" />
        <AlertDescription>
          Error loading courses: {coursesError}
        </AlertDescription>
      </Alert>
    );
  }

  if (courseMutationsError) {
    return (
      <Alert variant="destructive">
        <AlertIcon variant="destructive" />
        <AlertDescription>
          Error with course operations: {courseMutationsError}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Course Management</h2>
          <p className="text-muted-foreground">
            Manage courses in real-time. Changes are reflected immediately.
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Course
        </Button>
      </div>

      {/* Real-time Status */}
      <div className="flex items-center gap-4">
        <Badge variant={coursesLoading ? 'secondary' : 'success'}>
          {coursesLoading ? (
            <>
              <Clock className="h-3 w-3 mr-1" />
              Syncing...
            </>
          ) : (
            <>
              <CheckCircle className="h-3 w-3 mr-1" />
              Live
            </>
          )}
        </Badge>
        <span className="text-sm text-muted-foreground">
          {courses?.length || 0} courses • Last updated: {new Date().toLocaleTimeString()}
        </span>
      </div>

      {/* Course Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {courses?.filter(c => c.isPublished).length || 0} published
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {adminEnrollments?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all courses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                adminEnrollments?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              From enrollments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Courses List */}
      {coursesLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading courses...</p>
        </div>
      ) : courses && courses.length > 0 ? (
        <div className="space-y-4">
          {courses.map((course) => {
            const stats = getCourseStats(course.id);
            return (
              <Card key={course.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {course.description || 'No description available'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge 
                        variant={course.isPublished ? 'success' : 'secondary'}
                      >
                        {course.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                      {course.isFeatured && (
                        <Badge variant="warning">Featured</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(course.price || 0)}
                      </p>
                      <p className="text-xs text-muted-foreground">Price</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {stats.totalEnrollments}
                      </p>
                      <p className="text-xs text-muted-foreground">Enrollments</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">
                        {formatCurrency(stats.totalRevenue)}
                      </p>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {stats.completionRate}%
                      </p>
                      <p className="text-xs text-muted-foreground">Completion</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTogglePublish(course.id, course.isPublished)}
                      disabled={courseMutationsLoading}
                    >
                      {course.isPublished ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleFeatured(course.id, course.isFeatured)}
                      disabled={courseMutationsLoading}
                    >
                      {course.isFeatured ? 'Remove Featured' : 'Make Featured'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingCourse(course)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a href={`/course/${course.id}`} target="_blank" rel="noopener noreferrer">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No courses found</p>
            <Button 
              className="mt-4" 
              onClick={() => setShowCreateForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Course
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Course Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Course</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={async (e) => {
              e.preventDefault();
              
              if (!validateForm()) {
                return;
              }

              setIsSubmitting(true);

              const courseData = {
                title: values.title,
                instructor: values.instructor,
                description: values.description,
                price: parseInt(values.price) * 100, // Convert to paise
                category: values.category,
                duration: parseInt(values.duration),
                difficulty: values.difficulty
              };

              try {
                const result = await createCourse(courseData);
                if (result.success) {
                  setShowCreateForm(false);
                  resetForm();
                }
              } catch (error) {
                console.error('Error creating course:', error);
              } finally {
                setIsSubmitting(false);
              }
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Course Title"
                  type="text"
                  placeholder="Enter course title"
                  required
                  value={values.title}
                  onChange={(value) => handleChange('title', value)}
                  onBlur={() => handleBlur('title')}
                  error={errors.title}
                />
                <FormField
                  label="Instructor"
                  type="text"
                  placeholder="Enter instructor name"
                  required
                  value={values.instructor}
                  onChange={(value) => handleChange('instructor', value)}
                  onBlur={() => handleBlur('instructor')}
                  error={errors.instructor}
                />
                <div className="md:col-span-2">
                  <FormField
                    label="Description"
                    type="textarea"
                    placeholder="Enter course description"
                    required
                    rows={3}
                    value={values.description}
                    onChange={(value) => handleChange('description', value)}
                    onBlur={() => handleBlur('description')}
                    error={errors.description}
                  />
                </div>
                <FormField
                  label="Price (₹)"
                  type="number"
                  placeholder="Enter price in rupees"
                  required
                  min="0"
                  value={values.price}
                  onChange={(value) => handleChange('price', value)}
                  onBlur={() => handleBlur('price')}
                  error={errors.price}
                />
                <FormField
                  label="Duration (hours)"
                  type="number"
                  placeholder="Enter duration in hours"
                  required
                  min="1"
                  value={values.duration}
                  onChange={(value) => handleChange('duration', value)}
                  onBlur={() => handleBlur('duration')}
                  error={errors.duration}
                />
                <FormField
                  label="Category"
                  type="select"
                  required
                  value={values.category}
                  onChange={(value) => handleChange('category', value)}
                  onBlur={() => handleBlur('category')}
                  error={errors.category}
                >
                  <option value="">Select category</option>
                  <option value="ai-ml">AI & Machine Learning</option>
                  <option value="web-development">Web Development</option>
                  <option value="cybersecurity">Cybersecurity</option>
                  <option value="data-science">Data Science</option>
                  <option value="mobile-development">Mobile Development</option>
                </FormField>
                <FormField
                  label="Difficulty"
                  type="select"
                  required
                  value={values.difficulty}
                  onChange={(value) => handleChange('difficulty', value)}
                  onBlur={() => handleBlur('difficulty')}
                  error={errors.difficulty}
                >
                  <option value="">Select difficulty</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </FormField>
              </div>
              <div className="flex gap-2 mt-6">
                <Button type="submit" disabled={isSubmitting || courseMutationsLoading}>
                  {isSubmitting || courseMutationsLoading ? 'Creating...' : 'Create Course'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowCreateForm(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RealtimeCourseManagement;