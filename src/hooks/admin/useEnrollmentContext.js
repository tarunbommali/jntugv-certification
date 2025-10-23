/* eslint-disable no-console */
// ../hooks/admin/useEnrollmentContext.js

import { useState, useEffect } from "react";
import { getAllUsersData } from "../../firebase/services_modular/userOperations";
import { getUserEnrollments } from "../../firebase/services_modular/enrollmentOperations";
import { getAllCourses } from "../../firebase/services_modular/courseOperations";

export const useEnrollmentContext = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Fetching users and courses...");
      
      const [usersResult, coursesResult] = await Promise.all([
        getAllUsersData(500),
        getAllCourses(),
      ]);

      console.log("Users result:", usersResult);
      console.log("Courses result:", coursesResult);

      if (usersResult?.success) {
        setUsers(usersResult.data || []);
      } else {
        throw new Error(usersResult?.error || "Failed to fetch users");
      }

      if (coursesResult?.success) {
        setCourses(coursesResult.data || []);
      } else {
        throw new Error(coursesResult?.error || "Failed to fetch courses");
      }

      await fetchAllEnrollments(usersResult.data || []);
    } catch (err) {
      console.error("Error in fetchAllData:", err);
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllEnrollments = async (userList) => {
    if (!userList || userList.length === 0) {
      console.log("No users found to fetch enrollments");
      setEnrollments([]);
      return;
    }

    try {
      console.log(`Fetching enrollments for ${userList.length} users...`);
      
      const enrollmentPromises = userList.map(async (user) => {
        if (!user?.uid) {
          console.warn("User missing UID:", user);
          return [];
        }

        try {
          const result = await getUserEnrollments(user.uid);
          console.log(`Enrollments for user ${user.uid}:`, result);
          
          if (result?.success && Array.isArray(result.data)) {
            return result.data.map(enrollment => ({
              ...enrollment,
              user: user,
              course: courses.find(c => c.courseId === enrollment.courseId),
            }));
          }
          return [];
        } catch (userError) {
          console.error(`Error fetching enrollments for user ${user.uid}:`, userError);
          return [];
        }
      });

      const enrollmentArrays = await Promise.all(enrollmentPromises);
      const allEnrollments = enrollmentArrays.flat().filter(Boolean);
      
      console.log("Total enrollments found:", allEnrollments.length);
      setEnrollments(allEnrollments);
    } catch (err) {
      console.error("Error in fetchAllEnrollments:", err);
      setError("Failed to fetch enrollments");
      setEnrollments([]);
    }
  };

  const refreshData = () => {
    console.log("Refreshing enrollment data...");
    fetchAllData();
  };

  useEffect(() => {
    console.log("useEnrollmentContext mounted, fetching data...");
    fetchAllData();
  }, []);

  return {
    // State
    enrollments,
    users,
    courses,
    loading,
    error,
    
    // Actions
    refreshData,
    setEnrollments,
  };
};