import React, { useState, useEffect } from "react";
import CloseButton from '../ui/CloseButton';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Eye, EyeOff, Lock, Shield, AlertTriangle } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const base_url = 'http://localhost:8080';
const VERIFY_EMAIL_API = `${base_url}/request-forgotPassword`;
const VERIFY_OTP_API = `${base_url}/verify-Otp`;
const RESET_PASSWORD_API = `${base_url}/reset-password`;

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [userRole, setUserRole] = useState("");
    // Password visibility
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    // Password strength
    const [passwordStrength, setPasswordStrength] = useState(0);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.userRole) {
            setUserRole(location.state.userRole);
        }
    }, [location.state]);

    useEffect(() => {
        // Password strength calculation
        if (newPassword) {
            let strength = 0;
            if (newPassword.length >= 8) strength += 25;
            if (/[A-Z]/.test(newPassword)) strength += 25;
            if (/[0-9]/.test(newPassword)) strength += 25;
            if (/[^A-Za-z0-9]/.test(newPassword)) strength += 25;
            setPasswordStrength(strength);
        } else {
            setPasswordStrength(0);
        }
    }, [newPassword]);

    const getStrengthColor = () => {
        if (passwordStrength <= 25) return 'bg-red-500';
        if (passwordStrength <= 50) return 'bg-orange-500';
        if (passwordStrength <= 75) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getStrengthText = () => {
        if (passwordStrength <= 25) return 'Weak';
        if (passwordStrength <= 50) return 'Fair';
        if (passwordStrength <= 75) return 'Good';
        return 'Strong';
    };

    const handleClose = () => {
        navigate(-1);
    };

    const formContainer = "bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 border border-blue-100 relative overflow-hidden";
    const inputBase = "w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-gray-50 text-gray-800 placeholder-gray-400 text-base";
    const labelBase = "block text-sm font-semibold text-gray-700 mb-2";
    const buttonBase = "w-full py-4 px-6 bg-gradient-to-tr from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold text-lg rounded-xl shadow-lg transition-all hover:shadow-xl disabled:opacity-60 flex items-center justify-center gap-2";
    const iconBase = "inline-block align-middle w-6 h-6 text-white animate-spin";

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(
                VERIFY_EMAIL_API,
                {},
                {
                    params: {
                        email,
                        source: userRole,
                    },
                }
            );
            if (res.status !== 200) {
                throw new Error("Unable to verify email. Please try again.");
            }
            toast.success("OTP sent to your email address.");
            setStep(2);
        } catch (err) {
            toast.error(err.message || "Unable to verify email. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(
                VERIFY_OTP_API,
                {},
                {
                    params: {
                        email,
                        otp,
                    },
                }
            );
            if (res.status !== 200) {
                throw new Error("Invalid OTP. Please try again.");
            }
            toast.success("OTP verified. Please enter your new password.");
            setStep(3);
        } catch (err) {
            toast.error(err.message || "Invalid OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Password validation
        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters.");
            setLoading(false);
            return;
        }
        if (!/[A-Z]/.test(newPassword)) {
            toast.error("Password must contain at least one uppercase letter.");
            setLoading(false);
            return;
        }
        if (!/[0-9]/.test(newPassword)) {
            toast.error("Password must contain at least one number.");
            setLoading(false);
            return;
        }
        if (!/[^A-Za-z0-9]/.test(newPassword)) {
            toast.error("Password must contain at least one special character.");
            setLoading(false);
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post(
                RESET_PASSWORD_API,
                {},
                {
                    params: {
                        email,
                        newPassword,
                        source: userRole,
                    },
                }
            );
            if (res.status !== 200) {
                throw new Error("Failed to reset password. Please try again.");
            }
            toast.success("Your password has been reset successfully.");
            setStep(4);
        } catch (err) {
            toast.error(err.message || "Failed to reset password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { title: "Email", icon: "envelope" },
        { title: "OTP", icon: "key" },
        { title: "Password", icon: "lock-closed" },
        { title: "Done", icon: "check-circle" },
    ];

    function StepIcon({ name, active }) {
        const icons = {
            envelope: (
                <svg className={`w-6 h-6 ${active ? "text-blue-600" : "text-gray-300"}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect width="20" height="14" x="2" y="5" rx="2" stroke="currentColor" />
                    <path d="M22 5 12 13 2 5" stroke="currentColor" />
                </svg>
            ),
            key: (
                <svg className={`w-6 h-6 ${active ? "text-blue-600" : "text-gray-300"}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="15" cy="9" r="3" />
                    <path strokeLinecap="round" d="M2 15v4a2 2 0 002 2h4" />
                    <path strokeLinecap="round" d="M16.72 11.06A6 6 0 106 17h.01" />
                </svg>
            ),
            "lock-closed": (
                <svg className={`w-6 h-6 ${active ? "text-blue-600" : "text-gray-300"}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect width="18" height="10" x="3" y="11" rx="2" stroke="currentColor" />
                    <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" />
                </svg>
            ),
            "check-circle": (
                <svg className={`w-6 h-6 ${active ? "text-green-600" : "text-gray-300"}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l2 2 4-4" stroke="currentColor" />
                </svg>
            ),
        };
        return icons[name] || null;
    }

    // Helper to get login path based on userRole
    const getLoginPath = () => {
        if (userRole === "COLLEGE") return "/collegeLogin";
        if (userRole === "STUDENT") return "/studentLogin";
        if (userRole === "FACULTY") return "/facultyLogin";
        return "/login";
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-4">
            {/* Toast Container */}
            <ToastContainer 
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            
            <div className={formContainer}>
                {/* Close Button */}
                <div className="absolute top-6 right-6 z-50 p-1 rounded-full hover:bg-gray-100 transition-colors">
                    <CloseButton onClick={handleClose} />
                </div>

                {/* Modern Step Progress Indicator */}
                <div className="flex items-center justify-center mb-10 gap-1 mt-10">
                    {steps.map((s, idx) => {
                        const isActive = step - 1 >= idx;
                        return (
                            <React.Fragment key={s.title}>
                                <div className="flex flex-col items-center">
                                    <div className={`rounded-full border-4 ${isActive ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white"} shadow-md p-2 transition-all ${isActive ? "scale-110" : "scale-100"}`}>
                                        <StepIcon name={s.icon} active={isActive} />
                                    </div>
                                    <span className={`mt-2 text-xs font-semibold ${isActive ? "text-blue-700" : "text-gray-400"}`}>{s.title}</span>
                                </div>
                                {idx < steps.length - 1 && (
                                    <div className={`flex-1 h-1 mx-1 rounded-full ${step - 1 > idx ? "bg-blue-400" : "bg-gray-200"} transition-all duration-300`}></div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* Step 1: Email */}
                {step === 1 && (
                    <form onSubmit={handleEmailSubmit} className="space-y-6 animate-fade-in">
                        <div>
                            <label htmlFor="email" className={labelBase}>
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                className={inputBase}
                                placeholder="your@email.com"
                                autoFocus
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={buttonBase}
                        >
                            {loading && (
                                <svg className={iconBase} viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                            )}
                            {loading ? "Sending OTP..." : "Send OTP"}
                        </button>
                    </form>
                )}

                {/* Step 2: OTP */}
                {step === 2 && (
                    <form onSubmit={handleOtpSubmit} className="space-y-6 animate-fade-in">
                        <div>
                            <label htmlFor="otp" className={labelBase}>
                                One Time Password (OTP)
                            </label>
                            <input
                                id="otp"
                                type="text"
                                value={otp}
                                required
                                onChange={(e) => setOtp(e.target.value)}
                                disabled={loading}
                                className={inputBase}
                                placeholder="Enter the 6-digit OTP"
                                autoFocus
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={buttonBase}
                        >
                            {loading && (
                                <svg className={iconBase} viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                            )}
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </form>
                )}

                {/* Step 3: Set Password */}
                {step === 3 && (
                    <form onSubmit={handlePasswordSubmit} className="space-y-6 animate-fade-in">
                        <div>
                            <label htmlFor="newPassword" className={labelBase}>
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    id="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    required
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    disabled={loading}
                                    className={inputBase + (newPassword && passwordStrength < 50 ? ' border-red-300 bg-red-50' : '')}
                                    placeholder="Enter new password"
                                    autoFocus
                                />
                                
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    tabIndex={-1}
                                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                                >
                                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {newPassword && (
                                <div className="mt-2 space-y-1">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-medium text-gray-500">Password Strength</span>
                                        <span className={`text-xs font-medium ${
                                            passwordStrength <= 25 ? 'text-red-600' :
                                            passwordStrength <= 50 ? 'text-orange-600' :
                                            passwordStrength <= 75 ? 'text-yellow-600' :
                                            'text-green-600'
                                        }`}>
                                            {getStrengthText()}
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            style={{ width: `${passwordStrength}%` }}
                                            className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className={labelBase}>
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    required
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={loading}
                                    className={inputBase}
                                    placeholder="Re-enter new password"
                                />
                                
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    tabIndex={-1}
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {confirmPassword && newPassword !== confirmPassword && (
                                <p className="mt-1.5 text-sm text-red-600 flex items-center">
                                    <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                                    Passwords do not match
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={buttonBase}
                        >
                            {loading && (
                                <svg className={iconBase} viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                            )}
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </form>
                )}

                {/* Step 4: Success */}
                {step === 4 && (
                    <div className="text-center space-y-6 animate-fade-in">
                        <div className="text-3xl text-green-600 flex flex-col items-center">
                            <svg className="mx-auto mb-4 w-16 h-16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-bold">Password Reset Successful!</span>
                        </div>
                        <p className="text-gray-600 text-lg">
                            You can now{" "}
                            <Link
                                to={getLoginPath()}
                                className="text-blue-600 hover:underline font-semibold"
                            >
                                login
                            </Link>{" "}
                            with your new password.
                        </p>
                        <div className="pt-4">
                            <Link
                                to={getLoginPath()}
                                className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-colors"
                            >
                                Go to Login
                            </Link>
                        </div>
                    </div>
                )}

                {/* Subtle background decoration */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-tr from-blue-200 to-blue-400 rounded-full opacity-20 blur-xl pointer-events-none"></div>
                <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-gradient-to-br from-blue-200 to-blue-400 rounded-full opacity-20 blur-xl pointer-events-none"></div>
                <div className="absolute top-1/2 -right-20 w-40 h-40 bg-blue-100 rounded-full opacity-10 blur-lg pointer-events-none"></div>
            </div>
        </div>
    );
};

export default ForgotPassword;