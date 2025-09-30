import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Website from "./pages/Website.jsx";
import Header from "./components/Header.jsx";
import CoursePage from "./pages/CoursePage";
import WhatsAppChat from "./components/WhatsAppChat.jsx";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import HomeCourses from "./pages/HomeCourses.jsx";
import CourseContent from "./pages/CourseContent.jsx";

import CheckoutPage from "./pages/CheckoutPage.jsx";

// 404 Not Found Component
const NotFound = () => (
  <div className="flex flex-col items-center justify-center h-screen text-center">
    <h1 className="text-6xl font-bold text-[#004080] mb-4">404</h1>
    <p className="text-xl mb-6">Oops! Page not found.</p>
    <a
      href="/"
      className="px-6 py-3 bg-[#004080] text-white rounded hover:bg-[#00264d] transition-all"
    >
      Go Back Home
    </a>
  </div>
);

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Header />

        <Routes>
          <Route path="/" element={<Website />} />
           <Route path="/course/:courseId" element={<CoursePage />} />

          {/* Auth */}
          <Route path="/auth/signin" element={<SignIn />} />
          <Route path="/auth/signup" element={<SignUp />} />

          {/* Catalog and learning */}
          <Route path="/courses" element={<HomeCourses />} />
          <Route
            path="/learn/:courseId"
            element={
              <ProtectedRoute>
                <CourseContent />
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

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <WhatsAppChat />
      </AuthProvider>
    </Router>
  );
};

export default App;
