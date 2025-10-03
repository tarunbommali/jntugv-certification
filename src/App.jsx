import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// Import your components
import LandingPage from "./pages/LandingPage.jsx";
import Header from "./components/Header.jsx";
import CourseDetailsPage from "./pages/CourseDetailsPage.jsx";
import WhatsAppChat from "./components/FloatingButtons/WhatsAppChat.jsx";
import ScrollToTop from "./components/FloatingButtons/ScrollToTop.jsx";
import Footer from "./components/Footer.jsx";

// Import Context Providers
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { CourseProvider } from "./contexts/CourseContext.jsx";
import { UserProvider } from "./contexts/UserContext.jsx";
import { PaymentProvider } from "./contexts/PaymentContext.jsx";
import { LearnPageProvider } from "./contexts/LearnPageContext.jsx";
import NotFound from './components/Error/NotFound.jsx';
// Import Page Components
import ProtectedRoute from "./components/Auth/ProtectedRoute.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import CoursePage from "./pages/CoursePage.jsx";
import LearnPage from "./pages/LearnPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";




// --- Component to handle conditional rendering ---
const MainLayout = ({ children }) => {
  const location = useLocation();

  // Define paths where the Header and Footer should be hidden
  const NO_NAV_PATHS = ['/auth/signin', '/auth/signup'];

  // Check if the current path starts with any of the paths to hide navigation
  const hideNavAndFooter = NO_NAV_PATHS.some(path => location.pathname.startsWith(path));

  return (
    <>
      {/* 1. Header is rendered ONLY if not on an Auth page */}
      {!hideNavAndFooter && <Header />}

      {/* 2. Main content (Routes) */}
      <main className={hideNavAndFooter ? "flex-grow" : ""}>
        {children}
      </main>

      {/* 3. Footer and WhatsAppChat are rendered ONLY if not on an Auth page */}
      {!hideNavAndFooter && <Footer />}
      {!hideNavAndFooter && <WhatsAppChat />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      {/* Start of Nested Providers */}
      <AuthProvider>
        <UserProvider>
          <CourseProvider>
            <PaymentProvider>
              <LearnPageProvider>

                <ScrollToTop />

                {/* The MainLayout wraps the visible parts of the application */}
                <MainLayout>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/courses" element={<CoursePage />} />

                    <Route path="/course/:courseId" element={<CourseDetailsPage />} />

                    {/* PROFILE ROUTE (Requires Auth) */}
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Auth Routes (No Header/Footer) */}
                    <Route path="/auth/signin" element={<SignIn />} />
                    <Route path="/auth/signup" element={<SignUp />} />

                    <Route
                      path="/learn/:courseId"
                      element={<ProtectedRoute><LearnPage /></ProtectedRoute>}
                    />

                    <Route
                      path="/checkout/:courseId"
                      element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>}
                    />

                    {/* Admin (Requires Auth and Admin Role) */}
                    <Route
                      path="/admin"
                      element={<ProtectedRoute requiredRole="admin"><AdminPage /></ProtectedRoute>}
                    />
                    <Route
                      path="/admin/:tabId"
                      element={<ProtectedRoute requiredRole="admin"><AdminPage /></ProtectedRoute>}
                    />

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </MainLayout>

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