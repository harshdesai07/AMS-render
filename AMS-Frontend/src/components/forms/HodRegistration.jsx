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

export default function hodRegistration() {
  const navigate = useNavigate();
  const location = useLocation();
  const facultyData = location.state?.item || null;
  const { facultyId } = useParams();
  const BASE_URL = "http://localhost:8080";
  const collegeId = sessionStorage.getItem("collegeId");
  const token = sessionStorage.getItem("collegeToken");

  const [formData, setFormData] = useState({
    facultyName: "",
    facultyEmail: "",
    facultyNumber: "",
    course: "",
    courseId: "",
    department: "",
    facultyDesignation: "HOD",
    countryCode: "+1",
  });

  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showDepartment, setShowDepartment] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const countryOptions = [
    { code: "+1", label: "+1 (USA)" },
    { code: "+91", label: "+91 (India)" },
    { code: "+44", label: "+44 (UK)" },
    { code: "+61", label: "+61 (AU)" },
    { code: "+81", label: "+81 (JP)" },
  ];

  const handleClose = () => {
    navigate(-1);  // this takes you back to the previous page
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    const initForm = async () => {
      if (facultyData && courses.length > 0) {
        const extractCountryCode = (phoneNumber) => {
          if (!phoneNumber) return "+1";
          return phoneNumber.slice(0, -10);
        };

        const extractPhoneNumber = (phoneNumber) => {
          if (!phoneNumber) return "";
          return phoneNumber.slice(-10);
        };

        const selectedCourse = courses.find(
          (course) => course.name === facultyData.facultyCourse
        );

        const newFormData = {
          facultyName: facultyData.facultyName || "",
          facultyEmail: facultyData.facultyEmail || "",
          facultyNumber: extractPhoneNumber(facultyData.facultyNumber),
          course: facultyData.facultyCourse || "",
          courseId: selectedCourse?.id || "",
          department: facultyData.facultyDepartment || "",
          facultyDesignation: "HOD",
          countryCode: extractCountryCode(facultyData.facultyNumber),
        };

        console.log("New Form Data:", newFormData);
        setFormData(newFormData);

        if (facultyData.facultyCourse) {
          await fetchDepartments(facultyData.facultyCourse);
        }
      }
    };

    initForm();
  }, [facultyData, courses]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/courses/${collegeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status !== 200) throw new Error("Failed to fetch courses");
      const data = await response.data;
      console.log("Fetched courses:", data);
      setCourses(data);
    } catch (error) {
      toast.error("Failed to fetch courses");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async (courseName) => {
    if (!courseName) return [];

    setLoading(true);
    try {
      const encodedCourseName = encodeURIComponent(courseName);
      const response = await axios.get(
        `${BASE_URL}/getDepartments/${collegeId}/${encodedCourseName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status !== 200) throw new Error("Failed to fetch departments");
      const data = await response.data;

      const departmentsList = Array.isArray(data) ? data : data.departments || [];
      setDepartments(departmentsList);
      setShowDepartment(departmentsList.length > 0);
      return departmentsList;
    } catch (error) {
      console.error("Department fetch error:", error);
      toast.error("Failed to fetch departments");
      setDepartments([]);
      setShowDepartment(false);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleChange = async (value, name) => {
    if (name === "courseId") {
      const selectedCourse = courses.find((course) => course.id == value);
      if (!selectedCourse) {
        console.error("Selected course not found");
        return;
      }

      const courseName = selectedCourse.name;

      setFormData((prev) => ({
        ...prev,
        courseId: value,
        course: courseName,
        department: "",
      }));

      setSelectedCourseId(value);

      try {
        await fetchDepartments(courseName);
      } catch (error) {
        console.error("Error fetching course data:", error);
        toast.error("Failed to fetch course details");
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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

    if (!formData.course) {
      newErrors.course = "Course is required";
      isValid = false;
    }

    if (showDepartment && !formData.department) {
      newErrors.department = "Department is required";
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
          ? "HOD updated successfully!"
          : "HOD registered successfully!"
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
                {facultyData ? "Update HOD" : "HOD Registration"}
              </h2>
              <p className="text-base text-gray-600">Enter Hod information</p>
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
                    placeholder="Enter HOD name"
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
                    placeholder="hod@email.com"
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
                  <select
                    value={formData.courseId}
                    onChange={(e) => handleChange(e.target.value, "courseId")}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none appearance-none bg-white"
                    disabled={loading}
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                  <BookOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                {errors.course && (
                  <p className="text-red-600 text-sm mt-1">{errors.course}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <div className="relative">
                  <select
                    value={formData.department}
                    onChange={(e) => handleChange(e.target.value, "department")}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none appearance-none bg-white"
                    disabled={loading || !formData.course}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                  <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                {errors.department && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.department}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Designation
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value="HOD"
                    disabled
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none bg-gray-50"
                  />
                  <GraduationCap className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
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