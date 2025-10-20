import { useState, useCallback } from "react";
import { createEnrollmentWithPayment } from "../firebase/services";
import { RAZORPAY_KEY_ID } from "../firebase";

/**
 * Custom hook to manage the Razorpay checkout process.
 * It loads the Razorpay SDK script and provides a payment initiation function.
 * @param {object} currentUser - The current Firebase user object (from useAuth).
 * @param {function} onPaymentSuccess - Callback function to run after successful payment confirmation.
 */
const useRazorpay = (currentUser, onPaymentSuccess) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dynamic Script Loading Function
  const loadScript = useCallback((src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  // Main Payment Initiation Function
  const initializePayment = useCallback(
    async (paymentDetails) => {
      if (!currentUser || !RAZORPAY_KEY_ID) {
        setError("Authentication or Razorpay Key is missing.");
        return false;
      }

      setIsLoading(true);
      setError(null);

      // Ensure Razorpay script is loaded
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );

      if (!res) {
        setError(
          "Razorpay SDK failed to load. Are you connected to the internet?"
        );
        setIsLoading(false);
        return false;
      }

      const amountInPaise = Math.round(paymentDetails.amount * 100);

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: amountInPaise,
        currency: "INR",
        name: "JNTU-GV Certification",
        description: `Enrollment for ${paymentDetails.courseTitle}`,
        image: "YOUR_COURSE_LOGO_URL",
        order_id: paymentDetails.orderId || "",

        handler: async (response) => {
          try {
            // Create enrollment + payment record in Firestore using batch operation
            const result = await createEnrollmentWithPayment(
              {
                userId: currentUser.uid,
                courseId: paymentDetails.courseId,
                courseTitle: paymentDetails.courseTitle,
                status: "SUCCESS",
                paymentData: {
                  paymentId: response.razorpay_payment_id,
                  amount: paymentDetails.amount,
                },
              },
              {
                userId: currentUser.uid,
                courseId: paymentDetails.courseId,
                courseTitle: paymentDetails.courseTitle,
                amount: paymentDetails.amount,
                currency: "INR",
                status: "captured",
                razorpayData: {
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  signature: response.razorpay_signature,
                },
              }
            );

            if (result.success) {
              // Execute the success callback provided by the component
              if (onPaymentSuccess) {
                onPaymentSuccess(result.data.enrollmentId, paymentDetails.courseId);
              }
            } else {
              setError("Payment successful, but failed to record enrollment. Please contact support.");
            }
          } catch (err) {
            setError(
              "Payment successful, but failed to record enrollment. Please contact support immediately."
            );
            console.error("Firestore Enrollment Error:", err);
          } finally {
            setIsLoading(false);
          }
        },

        // Pre-fill user details for better conversion
        prefill: {
          name: paymentDetails.billingInfo?.name || currentUser.displayName || "",
          email: paymentDetails.billingInfo?.email || currentUser.email || "",
          contact: paymentDetails.billingInfo?.phone || currentUser.phoneNumber || "",
        },

        theme: {
          color: "#004080",
        },
      };

      const rzp1 = new window.Razorpay(options);

      // Handle payment failure event
      rzp1.on("payment.failed", function (response) {
        setError(
          `Payment failed. Code: ${response.error.code}. Reason: ${response.error.description}`
        );
        console.error("Razorpay Error:", response.error);
        setIsLoading(false);
      });

      rzp1.open();
      setIsLoading(false);
      return true;
    },
    [currentUser, loadScript, onPaymentSuccess]
  );

  return { initializePayment, isLoading, error };
};

export default useRazorpay;