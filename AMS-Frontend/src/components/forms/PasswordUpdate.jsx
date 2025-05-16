import axios from 'axios';
import { AlertTriangle, ArrowRight, Check, Eye, EyeOff, Key, Loader2, Lock, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Toaster, toast } from "react-hot-toast";
import { useLocation, useNavigate } from 'react-router-dom';
import CloseButton from '../ui/CloseButton';

const PasswordUpdate = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole } = location.state || {};


  const handleClose = () => {
    navigate(-1);  // this takes you back to the previous page
  };

  useEffect(() => {
    if (formData.newPassword) {
      let strength = 0;
      if (formData.newPassword.length >= 8) strength += 25;
      if (/[A-Z]/.test(formData.newPassword)) strength += 25;
      if (/[0-9]/.test(formData.newPassword)) strength += 25;
      if (/[^A-Za-z0-9]/.test(formData.newPassword)) strength += 25;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [formData.newPassword]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

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

  const validate = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    } else if (!/[A-Z]/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one uppercase letter';
    } else if (!/[0-9]/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one number';
    } else if (!/[^A-Za-z0-9]/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one special character';
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.currentPassword && formData.newPassword === formData.currentPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      let id;
      let token;

      if (userRole === 'COLLEGE') {
        id = sessionStorage.getItem('collegeId');
        token = sessionStorage.getItem('collegeToken');
      }
      else if (userRole === 'STUDENT') {
        id = sessionStorage.getItem('studentId');
        token = sessionStorage.getItem('studentToken');
        
      }
      else if (userRole === 'HOD') {
        id = sessionStorage.getItem('hodId');
        token = sessionStorage.getItem('hodToken');
      }
      else if (userRole === 'FACULTY') {
        id = sessionStorage.getItem('facultyId');
        token = sessionStorage.getItem('facultyToken');
      }

      console.log('User ID:', id);
      console.log('User Role:', userRole);
      console.log('Token:', token);
      const response = await axios.put('http://localhost:8080/updatePassword', {
        id: id,
        role: userRole,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if(response.status === 200){
        toast.success('Password updated successfully');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setTimeout(() => {
        navigate('/');
      }, 2000); // Delay for 3 seconds
      }

      
    } catch (error) {
      let errorMessage = 'Failed to update password';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-[1.01] duration-300">

        {/* Close Button */}
        <div className="absolute top-4 right-4 z-10">
          <CloseButton onClick={handleClose} />
        </div>

        {/* Header Section */}
        <div className="px-8 pt-8 pb-6">
          <div className="text-center">
            <Lock className="w-16 h-16 mx-auto text-blue-600 mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Update Password</h2>
            <p className="text-gray-600">Keep your account secure with a strong password</p>
          </div>
        </div>

        <div className="px-8 pb-8">
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg flex items-start space-x-3 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
                'bg-red-50 text-red-800 border border-red-200'
              }`}>
              {message.type === 'success' ? (
                <Check className="h-5 w-5 mt-0.5 text-green-500 flex-shrink-0" />
              ) : (
                <AlertTriangle className="h-5 w-5 mt-0.5 text-red-500 flex-shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-10 py-3 border ${errors.currentPassword ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none`}
                  placeholder="••••••••"
                />
                <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center">
                  <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                  {errors.currentPassword}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-10 py-3 border ${errors.newPassword ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none`}
                  placeholder="••••••••"
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {formData.newPassword && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-500">Password Strength</span>
                    <span className={`text-xs font-medium ${passwordStrength <= 25 ? 'text-red-600' :
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

              {errors.newPassword && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center">
                  <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                  {errors.newPassword}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-10 py-3 border ${errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none`}
                  placeholder="••••••••"
                />
                <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center">
                  <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center group text-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5 text-white" />
                    Updating...
                  </>
                ) : (
                  <>
                    Update Password
                    <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200">
              Need help? Contact support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordUpdate;