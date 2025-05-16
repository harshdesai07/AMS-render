import { ArrowRight, Users, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import CloseButton from '../ui/CloseButton';

function FacultyLogin() {
  const [email, setEmail] = useState('');
  const [facultyPassword, setPassword] = useState('');
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
    navigate('/forgot-password', { state: { userRole: 'FACULTY' } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError('Invalid email format');
      return;
    }

    const loadingToast = toast.loading('Logging in...');

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password: facultyPassword,
        }),
      });

      const data = await response.json();
      toast.dismiss(loadingToast);

      if (response.ok) {
        if (data.designation === 'HOD') {
          sessionStorage.setItem('hodToken', data.token);
          sessionStorage.setItem('hodCourse', data.course);
          sessionStorage.setItem('hodDepartment', data.department)
          sessionStorage.setItem('hodCollegeId', data.collegeId)
          sessionStorage.setItem('hodId', data.id);
        }
        else {
          sessionStorage.setItem('facultyToken', data.token);
          sessionStorage.setItem('facultyId', data.id);
          sessionStorage.setItem('facultyDepartment', data.department);
          sessionStorage.setItem('facultyCourse', data.course);
          sessionStorage.setItem('facultyCollegeId', data.collegeId);
          sessionStorage.setItem('facultyName', data.name);
        }

        toast.success('Login successful!');

        if (data.designation === 'HOD') {
          navigate('/hodDashboard');
        } else {
          navigate('/facultyDashboard');
        }
      } else {
        toast.error('Invalid credentials');
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error('Server error, please try again later');
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
              <Users className="w-16 h-16 mx-auto text-blue-600 mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Please sign in to your faculty account</p>
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
                  Faculty Email
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
                    value={facultyPassword}
                    onChange={(e) => setPassword(e.target.value)}
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
            faculty support
          </a>
        </p>
      </div>
    </div>
  );
}

export default FacultyLogin;