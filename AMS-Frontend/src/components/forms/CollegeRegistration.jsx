import { Building2, GraduationCap, Lock, Mail, School, ArrowRight, Eye, EyeOff, Key, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import collegeList from "../data/collegeList";
import CloseButton from '../ui/CloseButton';

export default function CollegeRegistration() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    collegeName: "",
    email: "",
    type: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    navigate(-1);  // this takes you back to the previous page
  };

  useEffect(() => {
    if (formData.password) {
      let strength = 0;
      if (formData.password.length >= 8) strength += 25;
      if (/[A-Z]/.test(formData.password)) strength += 25;
      if (/[0-9]/.test(formData.password)) strength += 25;
      if (/[^A-Za-z0-9]/.test(formData.password)) strength += 25;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [formData.password]);

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

  const handleChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, [e.target.name]: value });

    if (e.target.name === "collegeName") {
      if (value === "") {
        setShowDropdown(false);
        return;
      }

      const filtered = collegeList.filter((college) =>
        college.toLowerCase().includes(value.toLowerCase())
      );

      setFilteredColleges(filtered);
      setShowDropdown(filtered.length > 0);
    }

    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSelectCollege = (college) => {
    setFormData({ ...formData, collegeName: college });
    setShowDropdown(false);
  };

  const validatePassword = (password) => {
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasSpecialChar = /[@._]/.test(password);

    if (!hasNumber) return "Password must contain at least one number";
    if (!hasLetter) return "Password must contain at least one letter";
    if (!hasSpecialChar) return "Password must contain at least one special character (@, ., or _)";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.collegeName.trim()) {
      newErrors.collegeName = "College Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.type) {
      newErrors.type = "Please select a type of institution";
    }

    const passwordError = validatePassword(formData.password);
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (passwordError) {
      newErrors.password = passwordError;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const loadingToast = toast.loading("Registering...");

    try {
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      toast.dismiss(loadingToast);

      if (response.ok) {
        toast.success("Registration successful!");
        setTimeout(() => navigate("/"), 1500);
      } else if (response.status === 409) {
        if (responseData.message.includes("College already exists")) {
          toast.error("This college name is already registered");
        } else if (responseData.message.includes("Email already exists.")) {
          toast.error("This email is already registered. Please SignIn");
        } else {
          toast.error("A duplicate entry exists");
        }
      } else {
        toast.error(responseData.message || "Registration failed");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Network error. Please try again");
      console.error("Network Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-[1.01] duration-300">

          {/* Close Button */}
          <div className="absolute top-4 right-4 z-10">
            <CloseButton onClick={handleClose} />
          </div>

          {/* Header Section */}
          <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6">
            <div className="text-center">
              <GraduationCap className="w-14 h-14 sm:w-16 sm:h-16 mx-auto text-blue-600 mb-3 sm:mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">College Registration</h2>
              <p className="text-sm sm:text-base text-gray-600">Create your college account</p>
            </div>
          </div>

          <div className="px-6 sm:px-8 pb-6 sm:pb-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* College Name Field */}
              <div className="relative space-y-1 sm:space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  College Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="collegeName"
                    value={formData.collegeName}
                    onChange={handleChange}
                    onFocus={() => setShowDropdown(true)}
                    className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-sm sm:text-base"
                    placeholder="Enter college name"
                    autoComplete="off"
                  />
                  <School className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                {showDropdown && (
                  <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                    {filteredColleges.map((college, index) => (
                      <li
                        key={index}
                        onClick={() => handleSelectCollege(college)}
                        className="p-2.5 sm:p-3 hover:bg-gray-50 cursor-pointer text-gray-700 text-sm sm:text-base"
                      >
                        {college}
                      </li>
                    ))}
                  </ul>
                )}
                {errors.collegeName && (
                  <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.collegeName}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-1 sm:space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-sm sm:text-base"
                    placeholder="your@college.edu"
                  />
                  <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                {errors.email && (
                  <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Institution Type */}
              <div className="space-y-1 sm:space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Type of Institution
                </label>
                <div className="relative">
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none appearance-none bg-white text-sm sm:text-base"
                  >
                    <option value="">Select Type</option>
                    <option value="Private">Private</option>
                    <option value="Government">Government</option>
                    <option value="Autonomous">Autonomous</option>
                  </select>
                  <Building2 className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                {errors.type && (
                  <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.type}</p>
                )}
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                <div className="space-y-1 sm:space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 sm:pl-12 pr-10 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-sm sm:text-base"
                      placeholder="••••••••"
                    />
                    <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </button>
                  </div>
                  {formData.password && (
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
                  {errors.password && (
                    <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-10 sm:pl-12 pr-10 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-sm sm:text-base"
                      placeholder="••••••••"
                    />
                    <Shield className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center group text-sm sm:text-lg mt-6 sm:mt-8"
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Registering...
                  </>
                ) : (
                  <>
                    Complete Registration
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center mt-4 sm:mt-6 text-gray-600 text-xs sm:text-sm">
          Already have an account?{" "}
          <a href="/collegeLogin" className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
            Sign in here
          </a>
        </p>
      </div>
    </div>
  );
}