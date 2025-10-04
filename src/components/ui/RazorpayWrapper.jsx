import React, { useEffect } from 'react';

const RazorpayWrapper = ({ children }) => {
  useEffect(() => {
    // Suppress Razorpay feature policy warnings
    const originalConsoleWarn = console.warn;
    console.warn = (...args) => {
      const message = args[0];
      if (typeof message === 'string' && 
          (message.includes('Feature Policy: Skipping unsupported feature name') ||
           message.includes('otp-credentials') ||
           message.includes('payment') ||
           message.includes('clipboard-write'))) {
        // Suppress these specific Razorpay warnings
        return;
      }
      // Log other warnings normally
      originalConsoleWarn.apply(console, args);
    };

    // Cleanup function to restore original console.warn
    return () => {
      console.warn = originalConsoleWarn;
    };
  }, []);

  return <>{children}</>;
};

export default RazorpayWrapper;