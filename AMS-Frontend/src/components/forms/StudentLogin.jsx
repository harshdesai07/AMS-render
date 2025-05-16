import { ArrowRight, GraduationCap, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CloseButton from '../ui/CloseButton';

export default function studentLogin() {
  const [email, setEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1);  // this takes you back to the previous page
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setEmail(email);

    if (!validateEmail(email)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    navigate('/forgot-password', { state: { userRole: 'STUDENT' } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError('Invalid email format');
      return;
    }

    const loadingToast = toast.loading('Logging in...');

    try {
      const response = await axios.post('http://localhost:8080/auth/login', {
        email,
        password: studentPassword,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      toast.dismiss(loadingToast);

      if (response.data.token) {
        sessionStorage.setItem('studentToken', response.data.token);
        sessionStorage.setItem('studentName', response.data.name);
        sessionStorage.setItem('studentSemester', response.data.semester);
        sessionStorage.setItem('studentDepartment', response.data.department);
        sessionStorage.setItem('studentRollNumber', response.data.rollNumber);

        if (response.data.id) {
          sessionStorage.setItem('studentId', response.data.id);
        }

        toast.success('Login successful!');
        navigate('/studentDashboard');
      } else {
        toast.error('Invalid response from server');
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      if (axios.isAxiosError(err) && err.response) {
        const errorMessage = err.response.data.error || err.response.data.message || 'Invalid credentials';
        toast.error(errorMessage);
      } else {
        toast.error('Server error, please try again later');
      }
      console.error('Login Error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-[1.01] duration-300">

          {/* Close Button */}
          <div className="absolute top-4 right-4 z-10">
            <CloseButton onClick={handleClose} />
          </div>

          {/* Header Section */}
          <div className="px-8 pt-8 pb-6">
            <div className="text-center">
              <GraduationCap className="w-16 h-16 mx-auto text-blue-600 mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Please sign in to your student account</p>
            </div>
          </div>

          {/* Error Message */}
          {emailError && (
            <div className="mx-8 mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r">
              <p className="text-red-700 text-sm">{emailError}</p>
            </div>
          )}

          {/* Form Section */}
          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Student Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                    placeholder="your@email.com"
                    required
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                    placeholder="••••••••"
                    required
                  />
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center group text-lg cursor-pointer"
              >
                Sign In
                <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </form>

            <div className="mt-6 text-center cursor-pointer">
              <button
                onClick={handleForgotPassword}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200 bg-transparent border-none p-0 underline cursor-pointer"
                style={{ background: 'none', border: 'none' }}
              >
                Forgot your password?
              </button>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center mt-6 text-gray-600 text-sm">
          Need help? Contact{" "}
          <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
            student support
          </a>
        </p>
      </div>
    </div>
  );
}