import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import WhatsAppChat from '../FloatingButtons/WhatsAppChat';
import ScrollToTop from '../FloatingButtons/ScrollToTop';

const AppLayout = ({ children }) => {
  const location = useLocation();
  
  // Define paths where the Header and Footer should be hidden
  const NO_NAV_PATHS = ['/auth/signin', '/auth/signup'];
  
  // Check if the current path starts with any of the paths to hide navigation
  const hideNavAndFooter = NO_NAV_PATHS.some(path => location.pathname.startsWith(path));

  return (
    <>
      {/* Scroll to top functionality */}
      <ScrollToTop />
      
      {/* Header is rendered ONLY if not on an Auth page */}
      {!hideNavAndFooter && <Header />}

      {/* Main content */}
      <main className={hideNavAndFooter ? "flex-grow" : ""}>
        {children}
      </main>

      {/* Footer and WhatsAppChat are rendered ONLY if not on an Auth page */}
      {!hideNavAndFooter && (
        <>
          <Footer />
          <WhatsAppChat />
        </>
      )}
    </>
  );
};

export default AppLayout;