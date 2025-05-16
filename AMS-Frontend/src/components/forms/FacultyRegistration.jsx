import {
    ArrowRight,
    BookOpen,
    Building2,
    GraduationCap,
    Mail,
    Phone,
    User,
    Users,
  } from "lucide-react";
  import React, { useEffect, useState } from "react";
  import { Toaster, toast } from "react-hot-toast";
  import { useLocation, useNavigate, useParams } from "react-router-dom";
  import axios from "axios";
  import CloseButton from '../ui/CloseButton';
  
  export default function FacultyRegistration() {
    const navigate = useNavigate();
    const location = useLocation();
    const facultyData = location.state?.faculty || null;
    const { facultyId } = useParams();
    const BASE_URL = "http://localhost:8080";
    const collegeId = sessionStorage.getItem("hodCollegeId");
    const token = sessionStorage.getItem("hodToken");
    const hodCourse = sessionStorage.getItem("hodCourse");
    const hodDepartment = sessionStorage.getItem("hodDepartment");
  
    const [formData, setFormData] = useState({
      facultyName: "",
      facultyEmail: "",
      facultyNumber: "",
      course: hodCourse || "",
      department: hodDepartment || "",
      facultyDesignation: "",
      countryCode: "+1",
    });
  
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
  
    const countryOptions = [
      { code: "+1", label: "+1 (USA)" },
      { code: "+91", label: "+91 (India)" },
      { code: "+44", label: "+44 (UK)" },
      { code: "+61", label: "+61 (AU)" },
      { code: "+81", label: "+81 (JP)" },
    ];
  
    const designationOptions = [
      "Assistant Professor",
      "Associate Professor"
    ];

    const handleClose = () => {
      navigate(-1);  // this takes you back to the previous page
    };
  
    useEffect(() => {
      if (facultyData) {
        const extractCountryCode = (phoneNumber) => {
          if (!phoneNumber) return "+1";
          return phoneNumber.slice(0, -10);
        };
  
        const extractPhoneNumber = (phoneNumber) => {
          if (!phoneNumber) return "";
          return phoneNumber.slice(-10);
        };
  
        const newFormData = {
          facultyName: facultyData.facultyName || "",
          facultyEmail: facultyData.facultyEmail || "",
          facultyNumber: extractPhoneNumber(facultyData.facultyNumber),
          course: hodCourse || "",
          department: hodDepartment || "",
          facultyDesignation: facultyData.facultyDesignation || "",
          countryCode: extractCountryCode(facultyData.facultyNumber),
        };
  
        setFormData(newFormData);
      }
    }, [facultyData]);
  
    const handleChange = (value, name) => {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const validateForm = () => {
      let isValid = true;
      const newErrors = {};
  
      if (!formData.facultyName.trim()) {
        newErrors.facultyName = "Name is required";
        isValid = false;
      }
  
      if (!formData.facultyNumber.trim()) {
        newErrors.facultyNumber = "Phone number is required";
        isValid = false;
      } else if (!/^\d{10}$/.test(formData.facultyNumber)) {
        newErrors.facultyNumber = "Phone number must be exactly 10 digits";
        isValid = false;
      }
  
      if (!formData.facultyDesignation) {
        newErrors.facultyDesignation = "Designation is required";
        isValid = false;
      }
  
      setErrors(newErrors);
      return isValid;
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validateForm()) return;
  
      const fullPhoneNumber = `${formData.countryCode}${formData.facultyNumber}`;
      const loadingToast = toast.loading(
        facultyData ? "Updating..." : "Registering..."
      );
  
      try {
        let response;
        const dtoData = {
          facultyName: formData.facultyName,
          facultyEmail: formData.facultyEmail,
          facultyNumber: fullPhoneNumber,
          course: formData.course,
          department: formData.department,
          facultyDesignation: formData.facultyDesignation,
        };
  
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
  
       
             if (facultyData) {
               response = await axios.put(
                 `${BASE_URL}/updatefaculty/${facultyId}`,
                 dtoData,
                 { headers }
               );
        } else {
          response = await axios.post(
            `${BASE_URL}/facultyregister/${collegeId}`,
            dtoData,
            { headers }
          );
        }
  
        toast.success(
          facultyData
            ? "Faculty updated successfully!"
            : "Faculty registered successfully!"
        );
        navigate(-1);
      } catch (error) {
        toast.error(error.message || "An error occurred");
      } finally {
        toast.dismiss(loadingToast);
      }
    };
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <Toaster position="top-center" />
        <div className="w-full max-w-xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-[1.01] duration-300">
            
            {/* Close Button */}
                      <div className="absolute top-4 right-4 z-10">
                        <CloseButton onClick={handleClose} />
                      </div>
                      
            <div className="px-8 pt-8 pb-6">
              <div className="text-center">
                <Users className="w-16 h-16 mx-auto text-blue-600 mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {facultyData ? "Update Faculty" : "Faculty Registration"}
                </h2>
                <p className="text-base text-gray-600">Enter faculty information</p>
              </div>
            </div>
  
            <div className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.facultyName}
                      onChange={(e) => handleChange(e.target.value, "facultyName")}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                      placeholder="Enter faculty name"
                    />
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                  {errors.facultyName && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.facultyName}
                    </p>
                  )}
                </div>
  
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={formData.facultyEmail}
                      onChange={(e) => handleChange(e.target.value, "facultyEmail")}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                      placeholder="faculty@email.com"
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                  {errors.facultyEmail && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.facultyEmail}
                    </p>
                  )}
                </div>
  
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Course
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.course}
                      disabled
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none bg-gray-50"
                    />
                    <BookOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </div>
  
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.department}
                      disabled
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none bg-gray-50"
                    />
                    <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </div>
  
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Designation
                  </label>
                  <div className="relative">
                    <select
                      value={formData.facultyDesignation}
                      onChange={(e) => handleChange(e.target.value, "facultyDesignation")}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none appearance-none bg-white"
                    >
                      <option value="">Enter designation</option>
                      {designationOptions.map((designation) => (
                        <option key={designation} value={designation}>
                          {designation}
                        </option>
                      ))}
                    </select>
                    <GraduationCap className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                  {errors.facultyDesignation && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.facultyDesignation}
                    </p>
                  )}
                </div>
  
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="flex space-x-2">
                    <div className="relative w-32">
                      <select
                        value={formData.countryCode}
                        onChange={(e) => handleChange(e.target.value, "countryCode")}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none appearance-none bg-white"
                      >
                        {countryOptions.map((option) => (
                          <option key={`country-${option.code}`} value={option.code}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                    <div className="relative flex-1">
                      <input
                        type="tel"
                        value={formData.facultyNumber}
                        onChange={(e) =>
                          handleChange(
                            e.target.value.replace(/\D/, ""),
                            "facultyNumber"
                          )
                        }
                        maxLength={10}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                        placeholder="Phone number"
                      />
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                  </div>
                  {errors.facultyNumber && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.facultyNumber}
                    </p>
                  )}
                </div>
  
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center group text-lg mt-8"
                  disabled={loading}
                >
                  {facultyData ? "Update Faculty" : "Complete Registration"}
                  <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }