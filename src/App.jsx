import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import Layout Components
import AppLayout from "./components/layout/AppLayout.jsx";
import { LoadingScreen } from "./components/ui/LoadingSpinner.jsx";

// Import Context Providers
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { CourseProvider } from "./contexts/CourseContext.jsx";
import { UserProvider } from "./contexts/UserContext.jsx";
import { PaymentProvider } from "./contexts/PaymentContext.jsx";
import { LearnPageProvider } from "./contexts/LearnPageContext.jsx";
import { RealtimeProvider } from "./contexts/RealtimeContext.jsx";
import NotFound from './components/Error/NotFound.jsx';

// Import Page Components
import ProtectedRoute from "./components/Auth/ProtectedRoute.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import CoursePage from "./pages/CoursePage.jsx";
import CourseDetailsPage from "./pages/CourseDetailsPage.jsx";
import LearnPage from "./pages/LearnPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import LegalPage from "./pages/LegalPage.jsx";

// Lazy load admin components for code splitting
const AdminPage = lazy(() => import("./pages/admin/AdminPage.jsx"));
const Analytics = lazy(() => import('./pages/admin/Analytics.jsx'));
const CourseForm = lazy(() => import('./pages/admin/CourseForm.jsx'));
const UsersManagement = lazy(() => import('./pages/admin/UsersManagement.jsx'));
const AdminCoupons = lazy(() => import('./pages/admin/AdminCoupons.jsx'));
const Courses = lazy(() => import('./pages/admin/Courses.jsx'));

const App = () => {
  return (
    <Router>
      {/* Start of Nested Providers */}
      <AuthProvider>
        <UserProvider>
          <CourseProvider>
            <PaymentProvider>
              <LearnPageProvider>
                <RealtimeProvider>
                  {/* The AppLayout wraps the visible parts of the application */}
                  <AppLayout>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/courses" element={<CoursePage />} />
                    <Route path="/course/:courseId" element={<CourseDetailsPage />} />
                    <Route path="/legal/:page" element={<LegalPage />} />

                    {/* Auth Routes (No Header/Footer) */}
                    <Route path="/auth/signin" element={<SignIn />} />
                    <Route path="/auth/signup" element={<SignUp />} />

                    {/* Protected User Routes */}
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/learn/:courseId"
                      element={
                        <ProtectedRoute>
                          <LearnPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/checkout/:courseId"
                      element={
                        <ProtectedRoute>
                          <CheckoutPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Admin Routes with Code Splitting */}
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <Suspense fallback={<LoadingScreen />}>
                            <AdminPage />
                          </Suspense>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/analytics"
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <Suspense fallback={<LoadingScreen />}>
                            <Analytics />
                          </Suspense>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/users"
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <Suspense fallback={<LoadingScreen />}>
                            <UsersManagement />
                          </Suspense>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/courses"
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <Suspense fallback={<LoadingScreen />}>
                            <Courses />
                          </Suspense>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/coupons"
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <Suspense fallback={<LoadingScreen />}>
                            <AdminCoupons />
                          </Suspense>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/courses/edit/:courseId"
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <Suspense fallback={<LoadingScreen />}>
                            <CourseForm />
                          </Suspense>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/courses/create/new"
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <Suspense fallback={<LoadingScreen />}>
                            <CourseForm />
                          </Suspense>
                        </ProtectedRoute>
                      }
                    />

                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AppLayout>
                </RealtimeProvider>
              </LearnPageProvider>
            </PaymentProvider>
          </CourseProvider>
        </UserProvider>
      </AuthProvider>
      {/* End of Nested Providers */}
    </Router>
  );
};

export default App;