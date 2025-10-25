/* eslint-disable no-unused-vars */
import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ----------------------------
// Layout & UI Components
// ----------------------------
import AppLayout from "./components/layout/AppLayout.jsx";
import { LoadingScreen } from "./components/ui/LoadingSpinner.jsx";
import NotFound from "./components/Error/NotFound.jsx";
import ProtectedRoute from "./components/Auth/ProtectedRoute.jsx";

// ----------------------------
// Context Providers
// ----------------------------
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { UserProvider } from "./contexts/UserContext.jsx";
import { CourseProvider } from "./contexts/CourseContext.jsx";
import { PaymentProvider } from "./contexts/PaymentContext.jsx";
import { LearnPageProvider } from "./contexts/LearnPageContext.jsx";
import { RealtimeProvider } from "./contexts/RealtimeContext.jsx";

// ----------------------------
// Public Pages
// ----------------------------
import LandingPage from "./pages/LandingPage.jsx";
import CoursePage from "./pages/CoursePage.jsx";
import CourseDetailsPage from "./pages/CourseDetailsPage.jsx";
import LegalPage from "./pages/LegalPage.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";

// ----------------------------
// Protected User Pages
// ----------------------------
import ProfilePage from "./pages/ProfilePage.jsx";
import ProfileEdit from "./pages/ProfileEdit.jsx";
import LearnPage from "./pages/LearnPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";

// ----------------------------
// Admin Pages (Lazy Loaded for Performance)
// ----------------------------
const AdminPage = lazy(() => import("./pages/admin/AdminPage.jsx"));
const Analytics = lazy(() => import("./pages/admin/Analytics.jsx"));
const CourseForm = lazy(() => import("./pages/admin/CourseForm.jsx"));
const CourseManagement = lazy(() =>
  import("./pages/admin/CourseManagement.jsx")
);
const UsersManagement = lazy(() => import("./pages/admin/UsersManagement.jsx"));
const UserManagementForm = lazy(() =>
  import("./pages/admin/UserManagementForm.jsx")
);
const AdminCoupons = lazy(() => import("./pages/admin/AdminCoupons.jsx"));
const CreateEditCouponPage = lazy(() =>
  import("./pages/admin/CreateEditCouponPage.jsx")
);
const EnrollmentManagement = lazy(() =>
  import("./pages/admin/EnrollmentManagement.jsx")
);
const ManualEnrollmentForm = lazy(() =>
  import("./pages/admin/ManualEnrollmentForm.jsx")
);
// ----------------------------
// Main Application
// ----------------------------
const App = () => {
  return (
    <Router>
      {/* Context Providers (Outer → Inner hierarchy) */}
      <AuthProvider>
        <UserProvider>
          <CourseProvider>
            <PaymentProvider>
              <LearnPageProvider>
                <RealtimeProvider>
                  <AppLayout>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/courses" element={<CoursePage />} />
                      <Route
                        path="/course/:courseId"
                        element={<CourseDetailsPage />}
                      />
                      <Route path="/legal/:page" element={<LegalPage />} />

                      {/* Auth Routes (No Layout Header/Footer) */}
                      <Route path="/auth/signin" element={<SignIn />} />
                      <Route path="/auth/signup" element={<SignUp />} />

                      {/* User Protected Routes */}
                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute>
                            <ProfilePage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/profile/edit"
                        element={
                          <ProtectedRoute>
                            <ProfileEdit />
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

                      {/*  Admin Routes (Lazy Loaded) */}
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
                        path="/admin/users/create/new"
                        element={
                          <ProtectedRoute requiredRole="admin">
                            <Suspense fallback={<LoadingScreen />}>
                              <UserManagementForm />
                            </Suspense>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/users/manage/:userId"
                        element={
                          <ProtectedRoute requiredRole="admin">
                            <Suspense fallback={<LoadingScreen />}>
                              <UserManagementForm />
                            </Suspense>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/courses"
                        element={
                          <ProtectedRoute requiredRole="admin">
                            <Suspense fallback={<LoadingScreen />}>
                              <CourseManagement />
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
                        path="/admin/coupons/create"
                        element={
                          <ProtectedRoute requiredRole="admin">
                            <Suspense fallback={<LoadingScreen />}>
                              <CreateEditCouponPage />
                            </Suspense>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/coupons/edit/:couponId"
                        element={
                          <ProtectedRoute requiredRole="admin">
                            <Suspense fallback={<LoadingScreen />}>
                              <CreateEditCouponPage />
                            </Suspense>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/enrollments"
                        element={
                          <ProtectedRoute requiredRole="admin">
                            <Suspense fallback={<LoadingScreen />}>
                              <EnrollmentManagement />
                            </Suspense>
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/admin/enrollments/manual"
                        element={
                          <ProtectedRoute requiredRole="admin">
                            <Suspense fallback={<LoadingScreen />}>
                              <ManualEnrollmentForm />
                            </Suspense>
                          </ProtectedRoute>
                        }
                      />

                      {/* 404 Fallback */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AppLayout>
                </RealtimeProvider>
              </LearnPageProvider>
            </PaymentProvider>
          </CourseProvider>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
