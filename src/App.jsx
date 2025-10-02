import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// Import your components
import LandingPage from "./pages/LandingPage.jsx";
import Header from "./components/Header.jsx";
import CourseView from "./pages/CourseView.jsx";
import WhatsAppChat from "./components/WhatsAppChat.jsx";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer.jsx";

// Import Context Providers
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { CourseProvider } from "./contexts/CourseContext.jsx"; 
import { UserProvider } from "./contexts/UserContext.jsx";
import { PaymentProvider } from "./contexts/PaymentContext.jsx";
import { CourseContentProvider } from "./contexts/CourseContentContext.jsx";     

// Import Page Components
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import AdminCouponDashboard from "./pages/AdminCouponDashboard.jsx";
import CoursePage from "./pages/CoursePage.jsx";
import CourseContent from "./pages/CourseContent.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx"; 


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
              <CourseContentProvider>
                
                <ScrollToTop />
                
                {/* The MainLayout wraps the visible parts of the application */}
                <MainLayout>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/course/:courseId" element={<CourseView />} />
                 
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

                    {/* Catalog and learning */}
                    <Route path="/courses" element={<CoursePage />} />
                    <Route
                      path="/learn/:courseId"
                      element={<ProtectedRoute><CourseContent /></ProtectedRoute>}
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
                      path="/admin/coupons"
                      element={<ProtectedRoute requiredRole="admin"><AdminCouponDashboard /></ProtectedRoute>}
                    />

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </MainLayout>

              </CourseContentProvider>
            </PaymentProvider>
          </CourseProvider>
        </UserProvider>
      </AuthProvider>
      {/* End of Nested Providers */}
    </Router>
  );
};

export default App;