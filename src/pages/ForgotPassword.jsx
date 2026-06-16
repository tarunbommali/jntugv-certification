/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/index.js";
import { Loader2, Eye, EyeOff, CheckCircle } from "lucide-react";

const ForgotPassword = () => {
    const navigate = useNavigate();

    // Steps: 1 = Enter Email, 2 = Enter OTP, 3 = New Password
    const [step, setStep] = useState(1);

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Countdown timer for OTP resend
    const [countdown, setCountdown] = useState(0);

    // Step 1: Request OTP
    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!email) {
            setError("Please enter your email address.");
            return;
        }

        setLoading(true);
        try {
            const response = await authApi.requestPasswordReset(email);
            setSuccess("A 4-digit OTP has been sent to your email. Check your inbox.");
            setStep(2);
            setCountdown(300); // 5 minutes in seconds

            // Start countdown timer
            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            // In development, show OTP if returned
            if (response?.otp) {
                console.log("Development OTP:", response.otp);
                setSuccess(`OTP sent! (Dev mode: ${response.otp})`);
            }
        } catch (err) {
            setError(err?.message || err?.error || "Failed to send OTP. Please try again.");
        }
        setLoading(false);
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (otp.length !== 4) {
            setError("Please enter a valid 4-digit OTP.");
            return;
        }

        setLoading(true);
        try {
            const response = await authApi.verifyOtp(email, otp);
            setResetToken(response.resetToken);
            setSuccess("OTP verified! Now set your new password.");
            setStep(3);
        } catch (err) {
            setError(err?.message || err?.error || "Invalid or expired OTP. Please try again.");
        }
        setLoading(false);
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            await authApi.resetPassword({ token: resetToken, newPassword });
            setSuccess("Password reset successful! Redirecting to login...");
            setTimeout(() => navigate("/auth/signin"), 2000);
        } catch (err) {
            setError(err?.message || err?.error || "Failed to reset password. Please try again.");
        }
        setLoading(false);
    };

    // Format countdown
    const formatCountdown = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
            <div className="w-full max-w-lg bg-surface shadow-2xl rounded-xl p-8 sm:p-10 border border-border">

                {/* Logo and Branding - Same as SignIn/SignUp */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center justify-center space-x-2">
                        <img src="/logo-light.svg" alt="Aikya I/O" className="h-12 w-auto" />
                    </Link>
                </div>

                <h2 className="text-3xl font-bold text-foreground mb-2">
                    {step === 1 && "Forgot Password"}
                    {step === 2 && "Verify OTP"}
                    {step === 3 && "Set New Password"}
                </h2>

                <p className="text-muted text-sm mb-6">
                    {step === 1 && "Enter your email to receive a one-time password (OTP)"}
                    {step === 2 && `Enter the 4-digit OTP sent to ${email}`}
                    {step === 3 && "Create a strong new password for your account"}
                </p>

                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-3 mb-6">
                    {[1, 2, 3].map((s, index) => (
                        <React.Fragment key={s}>
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= s
                                        ? "bg-[var(--color-primary)] text-white"
                                        : "bg-surface-elevated text-muted"
                                    }`}
                            >
                                {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                            </div>
                            {index < 2 && (
                                <div className={`w-12 h-1 rounded-full ${step > s ? 'bg-[var(--color-primary)]' : 'bg-surface-elevated'}`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Error/Success Messages */}
                {error && (
                    <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded-lg mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border border-green-300 text-green-700 p-3 rounded-lg mb-4 text-sm text-center">
                        {success}
                    </div>
                )}

                {/* Step 1: Email Input */}
                {step === 1 && (
                    <form onSubmit={handleRequestOtp} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-muted mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                className="w-full border border-border p-3 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full text-white py-3 rounded-lg font-semibold transition-colors shadow-md flex items-center justify-center gap-2 ${loading
                                    ? "bg-gray-500 cursor-not-allowed"
                                    : "bg-[var(--color-primary)] hover:bg-[var(--color-primaryHover)]"
                                }`}
                        >
                            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                            {loading ? "Sending OTP..." : "Send OTP"}
                        </button>
                    </form>
                )}

                {/* Step 2: OTP Input */}
                {step === 2 && (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-muted mb-1">
                                Enter 4-Digit OTP
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                placeholder="1234"
                                maxLength={4}
                                className="w-full border border-border p-4 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition text-center text-3xl tracking-[0.5em] font-mono"
                                required
                            />
                        </div>

                        {countdown > 0 && (
                            <p className="text-sm text-muted text-center">
                                OTP expires in <span className="font-bold text-[var(--color-primary)]">{formatCountdown(countdown)}</span>
                            </p>
                        )}

                        {countdown === 0 && (
                            <button
                                type="button"
                                onClick={handleRequestOtp}
                                className="w-full text-sm text-[var(--color-primary)] hover:underline font-medium"
                            >
                                Resend OTP
                            </button>
                        )}

                        <button
                            type="submit"
                            disabled={loading || otp.length !== 4}
                            className={`w-full text-white py-3 rounded-lg font-semibold transition-colors shadow-md flex items-center justify-center gap-2 ${loading || otp.length !== 4
                                    ? "bg-gray-500 cursor-not-allowed"
                                    : "bg-[var(--color-primary)] hover:bg-[var(--color-primaryHover)]"
                                }`}
                        >
                            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>

                        <button
                            type="button"
                            onClick={() => { setStep(1); setOtp(""); }}
                            className="w-full py-2 text-muted hover:text-foreground text-sm"
                        >
                            Use a different email
                        </button>
                    </form>
                )}

                {/* Step 3: New Password Input */}
                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-muted mb-1">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full border border-border p-3 pr-12 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition"
                                    required
                                    minLength={8}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-muted focus:outline-none"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-muted mt-1">Must be at least 8 characters</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted mb-1">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full border border-border p-3 pr-12 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-muted focus:outline-none"
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {confirmPassword && newPassword !== confirmPassword && (
                                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full text-white py-3 rounded-lg font-semibold transition-colors shadow-md flex items-center justify-center gap-2 ${loading
                                    ? "bg-gray-500 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700"
                                }`}
                        >
                            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}

                {/* Back to Sign In Link */}
                <p className="mt-6 text-sm text-center text-muted">
                    Remember your password?{" "}
                    <Link
                        to="/auth/signin"
                        className="text-[var(--color-primary)] font-bold hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
