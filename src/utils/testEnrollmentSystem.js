/* eslint-disable no-console */
/**
 * Test script for enrollment system CRUD operations
 * This can be run in the browser console for testing
 */

import {
  createUserWithCredentials,
  getAllUsersData,
  toggleUserAccountStatus,
} from '../firebase/services_modular/userOperations';
import {
  createEnrollment,
  getUserEnrollments,
  updateEnrollment,
  deleteEnrollment,
  getUserEnrollmentStats,
} from '../firebase/services_modular/enrollmentOperations';
import { getAllCourses } from '../firebase/services_modular/courseOperations';

export const testEnrollmentSystem = async () => {
  console.log('🧪 Starting Enrollment System Tests...');
  
  const testResults = {
    userCreation: false,
    userListing: false,
    courseListing: false,
    enrollmentCreation: false,
    enrollmentListing: false,
    enrollmentUpdate: false,
    enrollmentDeletion: false,
    enrollmentStats: false,
  };

  let testUserId = null;
  let testCourseId = null;
  let testEnrollmentId = null;

  try {
    // Test 1: Create a test user
    console.log('📝 Test 1: Creating test user...');
    const userResult = await createUserWithCredentials({
      email: `test-${Date.now()}@example.com`,
      password: 'testpassword123',
      displayName: 'Test User',
      phone: '1234567890',
      role: 'student',
    });
    
    if (userResult.success) {
      testUserId = userResult.data.uid;
      testResults.userCreation = true;
      console.log('✅ User creation test passed');
    } else {
      console.error('❌ User creation test failed:', userResult.error);
    }

    // Test 2: List users
    console.log('📝 Test 2: Listing users...');
    const usersResult = await getAllUsersData(10);
    if (usersResult.success) {
      testResults.userListing = true;
      console.log('✅ User listing test passed');
    } else {
      console.error('❌ User listing test failed:', usersResult.error);
    }

    // Test 3: List courses
    console.log('📝 Test 3: Listing courses...');
    const coursesResult = await getAllCourses();
    if (coursesResult.success && coursesResult.data.length > 0) {
      testCourseId = coursesResult.data[0].courseId;
      testResults.courseListing = true;
      console.log('✅ Course listing test passed');
    } else {
      console.error('❌ Course listing test failed:', coursesResult.error);
    }

    if (!testUserId || !testCourseId) {
      console.error('❌ Cannot proceed with enrollment tests - missing test user or course');
      return testResults;
    }

    // Test 4: Create enrollment
    console.log('📝 Test 4: Creating enrollment...');
    const enrollmentResult = await createEnrollment({
      userId: testUserId,
      courseId: testCourseId,
      courseTitle: 'Test Course',
      coursePrice: 100,
      status: 'SUCCESS',
      paymentData: {
        amount: 100,
        method: 'offline',
        paymentId: `TEST_${Date.now()}`,
        reference: 'TEST_REF_123',
      },
      enrolledBy: 'admin',
    });

    if (enrollmentResult.success) {
      testEnrollmentId = enrollmentResult.data.id;
      testResults.enrollmentCreation = true;
      console.log('✅ Enrollment creation test passed');
    } else {
      console.error('❌ Enrollment creation test failed:', enrollmentResult.error);
    }

    // Test 5: List user enrollments
    console.log('📝 Test 5: Listing user enrollments...');
    const enrollmentsResult = await getUserEnrollments(testUserId);
    if (enrollmentsResult.success) {
      testResults.enrollmentListing = true;
      console.log('✅ Enrollment listing test passed');
    } else {
      console.error('❌ Enrollment listing test failed:', enrollmentsResult.error);
    }

    if (!testEnrollmentId) {
      console.error('❌ Cannot proceed with update/delete tests - missing test enrollment');
      return testResults;
    }

    // Test 6: Update enrollment
    console.log('📝 Test 6: Updating enrollment...');
    const updateResult = await updateEnrollment(testEnrollmentId, {
      status: 'PENDING',
      paidAmount: 150,
      paymentDetails: {
        method: 'online',
        reference: 'UPDATED_REF_456',
      },
    });

    if (updateResult.success) {
      testResults.enrollmentUpdate = true;
      console.log('✅ Enrollment update test passed');
    } else {
      console.error('❌ Enrollment update test failed:', updateResult.error);
    }

    // Test 7: Get enrollment stats
    console.log('📝 Test 7: Getting enrollment stats...');
    const statsResult = await getUserEnrollmentStats(testUserId);
    if (statsResult.success) {
      testResults.enrollmentStats = true;
      console.log('✅ Enrollment stats test passed');
    } else {
      console.error('❌ Enrollment stats test failed:', statsResult.error);
    }

    // Test 8: Delete enrollment
    console.log('📝 Test 8: Deleting enrollment...');
    const deleteResult = await deleteEnrollment(testEnrollmentId);
    if (deleteResult.success) {
      testResults.enrollmentDeletion = true;
      console.log('✅ Enrollment deletion test passed');
    } else {
      console.error('❌ Enrollment deletion test failed:', deleteResult.error);
    }

    // Test 9: Toggle user status
    console.log('📝 Test 9: Toggling user status...');
    const toggleResult = await toggleUserAccountStatus(testUserId, 'inactive');
    if (toggleResult.success) {
      console.log('✅ User status toggle test passed');
    } else {
      console.error('❌ User status toggle test failed:', toggleResult.error);
    }

  } catch (error) {
    console.error('❌ Test suite error:', error);
  }

  // Summary
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  Object.entries(testResults).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
  });

  const passedTests = Object.values(testResults).filter(Boolean).length;
  const totalTests = Object.keys(testResults).length;
  
  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! The enrollment system is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please check the errors above.');
  }

  return testResults;
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testEnrollmentSystem = testEnrollmentSystem;
}

export default testEnrollmentSystem;