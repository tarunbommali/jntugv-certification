import { useCallback, useState } from "react";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../services/index.js";

const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

const loadRazorpay = () => {
  if (window.Razorpay) return Promise.resolve(true);

  return new Promise((resolve) => {
    const existing = document.querySelector(`script[src="${RAZORPAY_SCRIPT}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const useRazorpay = (currentUser, onPaymentSuccess) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const initializePayment = useCallback(async (paymentDetails) => {
    if (!currentUser) {
      setError("Please sign in before starting payment.");
      return false;
    }

    setIsLoading(true);
    setError(null);

    const orderResult = await createRazorpayOrder({
      courseId: paymentDetails.courseId,
      couponCode: paymentDetails.coupon || undefined,
      billingInfo: paymentDetails.billingInfo,
    });

    if (!orderResult.success) {
      setError(orderResult.error || "Unable to create payment order.");
      setIsLoading(false);
      return false;
    }

    const order = orderResult.data;
    if (order.free) {
      onPaymentSuccess?.(order.enrollment?.id || null, paymentDetails.courseId);
      setIsLoading(false);
      return true;
    }

    const sdkLoaded = await loadRazorpay();
    if (!sdkLoaded) {
      setError("Razorpay checkout failed to load. Please check your connection.");
      setIsLoading(false);
      return false;
    }

    const checkout = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      order_id: order.orderId,
      name: "Aikya I/O",
      description: `Enrollment for ${order.course.title}`,
      prefill: {
        name: paymentDetails.billingInfo?.name || currentUser.username || "",
        email: paymentDetails.billingInfo?.email || currentUser.email || "",
        contact: paymentDetails.billingInfo?.phone || currentUser.phoneNumber || "",
      },
      theme: { color: "#004080" },
      modal: {
        ondismiss: () => setIsLoading(false),
      },
      handler: async (response) => {
        try {
          const verification = await verifyRazorpayPayment({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          if (!verification.success) {
            setError(verification.error || "Payment verification failed.");
            return;
          }

          onPaymentSuccess?.(
            verification.data?.enrollment?.id || null,
            paymentDetails.courseId
          );
        } catch (verificationError) {
          setError(
            verificationError?.message ||
              "Payment was received but enrollment verification failed. Please contact support."
          );
        } finally {
          setIsLoading(false);
        }
      },
    });

    checkout.on("payment.failed", (response) => {
      setError(response.error?.description || "Payment failed. Please try again.");
      setIsLoading(false);
    });

    checkout.open();
    return true;
  }, [currentUser, onPaymentSuccess]);

  return { initializePayment, isLoading, error };
};

export default useRazorpay;
