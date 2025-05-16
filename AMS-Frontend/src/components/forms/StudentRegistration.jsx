import axios from 'axios';
import {
  ArrowRight,
  BookOpen,
  Building2,
  GraduationCap,
  Mail,
  Phone,
  User,
  Hash
} from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CloseButton from '../ui/CloseButton';

export default function StudentRegistration() {
  const navigate = useNavigate();
  const location = useLocation();
  const studentData = location.state?.student || null;
  const { id: paramId } = useParams();
  const studentId = paramId || studentData?.studentId;
  const BASE_URL = "http://localhost:8080";
  const collegeId = sessionStorage.getItem("hodCollegeId");
  const token = sessionStorage.getItem("hodToken");
  const storedCourse = sessionStorage.getItem("hodCourse");
  const storedDepartment = sessionStorage.getItem("hodDepartment");

  const [formData, setFormData] = useState({
    studentName: "",
    studentEmail: "",
    studentNumber: "",
    studentParentsNumber: "",
    studentDepartment: storedDepartment || "",
    studentSem: "",
    countryCode: "+1",
    parentCountryCode: "+1",
    courseName: storedCourse || "",
    rollNumber: ""
  });

  const [semesters, setSemesters] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (storedCourse) {
      fetchSemesters(storedCourse).catch(error => {
        console.error("Error fetching semesters:", error);
        toast.error("Failed to fetch semesters");
      });
    }
  }, []);

  const handleClose = () => {
    navigate(-1);  // this takes you back to the previous page
  };

  useEffect(() => {
    const extractCountryCode = (phoneNumber) => {
      if (!phoneNumber) return "+1";
      return phoneNumber.slice(0, -10);
    };

    const extractPhoneNumber = (phoneNumber) => {
      if (!phoneNumber) return "";
      return phoneNumber.slice(-10);
    };

    if (studentData) {
      const newFormData = {
        studentName: studentData.studentName || "",
        studentEmail: studentData.studentEmail || "",
        studentNumber: extractPhoneNumber(studentData.studentNumber),
        studentParentsNumber: extractPhoneNumber(studentData.studentParentsNumber),
        studentDepartment: storedDepartment || "",
        studentSem: studentData.studentSem || "",
        countryCode: extractCountryCode(studentData.studentNumber),
        parentCountryCode: extractCountryCode(studentData.studentParentsNumber),
        courseName: storedCourse || "",
        rollNumber: studentData.rollNumber || ""
      };

      setFormData(newFormData);

      if (storedCourse) {
        fetchSemesters(storedCourse).then((semData) => {
          setSemesters(semData);
          setFormData((prev) => ({
            ...prev,
            studentSem:
              studentData.studentSem ||
              (semData.length > 0 ? semData[0].semesterNumber : ""),
          }));
        });
      }
    }
  }, [studentData]);

  const fetchSemesters = async (courseName) => {
    if (!courseName) return [];

    setLoading(true);
    try {
      const encodedCourseName = encodeURIComponent(courseName);
      const response = await fetch(`${BASE_URL}/getSemester/${encodedCourseName}`);
      if (!response.ok) throw new Error("Failed to fetch semesters");
      const data = await response.json();

      let semestersList = Array.isArray(data) ? data : [];

      if (studentData && studentData.semester) {
        semestersList = semestersList.filter(sem => {
          return getSemesterNumber(sem.semesterNumber) >= getSemesterNumber(studentData.semester);
        });
      }
      setSemesters(semestersList);
      return semestersList;
    } catch (error) {
      console.error("Semester fetch error:", error);
      toast.error("Failed to fetch semesters");
      setSemesters([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getSemesterNumber = (semester) => {
    if (!semester) return 0;
    const match = semester.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const handleChange = (value, name) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    if (!formData.studentName.trim()) {
      newErrors.studentName = "Name is required";
      isValid = false;
    }

    if (!formData.studentEmail.trim()) {
      newErrors.studentEmail = "Email is required";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.studentEmail)) {
      newErrors.studentEmail = "Invalid email format";
      isValid = false;
    }

    if (!formData.rollNumber.trim()) {
      newErrors.rollNumber = "Roll number is required";
      isValid = false;
    }

    if (!formData.studentNumber.trim()) {
      newErrors.studentNumber = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.studentNumber)) {
      newErrors.studentNumber = "Phone number must be exactly 10 digits";
      isValid = false;
    }

    if (!formData.studentParentsNumber.trim()) {
      newErrors.studentParentsNumber = "Parent's phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.studentParentsNumber)) {
      newErrors.studentParentsNumber = "Phone number must be exactly 10 digits";
      isValid = false;
    }

    if (formData.studentNumber === formData.studentParentsNumber &&
      formData.countryCode === formData.parentCountryCode) {
      newErrors.studentParentsNumber = "Parent's phone number must be different from student's number";
      isValid = false;
    }

    if (!formData.studentSem) {
      newErrors.studentSem = "Semester is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const fullPhoneNumber = `${formData.countryCode}${formData.studentNumber}`;
    const parentFullPhoneNumber = `${formData.parentCountryCode}${formData.studentParentsNumber}`;
    const loadingToast = toast.loading(studentData ? "Updating..." : "Registering...");

    try {
      let response;
      const dtoData = {
        studentEmail: formData.studentEmail,
        studentName: formData.studentName,
        studentNumber: fullPhoneNumber,
        studentParentsNumber: parentFullPhoneNumber,
        deptName: storedDepartment,
        courseName: storedCourse,
        semester: formData.studentSem.toString(),
        rollNumber: formData.rollNumber
      };

      if (!collegeId) {
        throw new Error("College ID is missing or invalid.");
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      if (studentData) {
        response = await axios.put(
          `${BASE_URL}/updatestudent/${studentId}`,
          dtoData,
          { headers }
        );
      } else {
        response = await axios.post(
          `${BASE_URL}/studentregister/${collegeId}`,
          dtoData,
          { headers }
        );
      }

      const successMessage = studentData
        ? "Student updated successfully!"
        : "Student registered successfully!";

      toast.success(successMessage);
      toast.dismiss(loadingToast);
      setTimeout(() => navigate("/hodDashboard"), 1500);

    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Error:", error);
      const errorMsg =
        error.response?.data?.message || error.response?.data || error.message || "An unexpected error occurred";
      toast.error(errorMsg);
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
              <User className="w-16 h-16 mx-auto text-blue-600 mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {studentData ? "Update Student" : "Student Registration"}
              </h2>
              <p className="text-base text-gray-600">Enter student information</p>
            </div>
          </div>

          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.studentName}
                    onChange={(e) => handleChange(e.target.value, "studentName")}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                    placeholder="Enter student name"
                  />
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                {errors.studentName && (
                  <p className="text-red-600 text-sm mt-1">{errors.studentName}</p>
                )}
              </div>

              {/* Roll Number field */}
              {/* Roll Number field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Roll Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.rollNumber}
                    onChange={(e) => handleChange(e.target.value, "rollNumber")}
                    className={`w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none ${studentData ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                      }`}
                    placeholder="Enter roll number"
                    disabled={!!studentData}
                  />
                  <Hash className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${studentData ? "text-gray-400" : "text-gray-400"
                    }`} />
                </div>
                {errors.rollNumber && (
                  <p className="text-red-600 text-sm mt-1">{errors.rollNumber}</p>
                )}
              </div>

              {/* Email field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.studentEmail}
                    onChange={(e) => handleChange(e.target.value, "studentEmail")}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                    placeholder="student@email.com"
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                {errors.studentEmail && (
                  <p className="text-red-600 text-sm mt-1">{errors.studentEmail}</p>
                )}
              </div>

              {/* Course field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Course
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={storedCourse}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-100 cursor-not-allowed"
                    disabled
                  />
                  <BookOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              {/* Department field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={storedDepartment}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-100 cursor-not-allowed"
                    disabled
                  />
                  <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              {/* Semester field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Semester
                </label>
                <div className="relative">
                  <select
                    value={formData.studentSem}
                    onChange={(e) => handleChange(e.target.value, "studentSem")}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none appearance-none bg-white"
                    disabled={loading}
                  >
                    <option value="">Select Semester</option>
                    {semesters.length > 0 ? (
                      semesters.map((sem) => (
                        <option key={sem.id} value={sem.semesterNumber}>
                          {sem.semesterNumber}
                        </option>
                      ))
                    ) : (
                      <option value="">No semesters available</option>
                    )}
                  </select>
                  <GraduationCap className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                {errors.studentSem && (
                  <p className="text-red-600 text-sm mt-1">{errors.studentSem}</p>
                )}
              </div>

              {/* Student Phone Number field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Student Phone Number
                </label>
                <div className="flex space-x-2">
                  <div className="relative w-32">
                    <select
                      value={formData.countryCode}
                      onChange={(e) => handleChange(e.target.value, "countryCode")}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none appearance-none bg-white"
                    >
                      <option value="+1">+1 (USA)</option>
                      <option value="+91">+91 (India)</option>
                      <option value="+44">+44 (UK)</option>
                      <option value="+61">+61 (AU)</option>
                      <option value="+81">+81 (JP)</option>
                    </select>
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      value={formData.studentNumber}
                      onChange={(e) => handleChange(e.target.value.replace(/\D/, ""), "studentNumber")}
                      maxLength={10}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                      placeholder="Phone number"
                    />
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </div>
                {errors.studentNumber && (
                  <p className="text-red-600 text-sm mt-1">{errors.studentNumber}</p>
                )}
              </div>

              {/* Parent Phone Number field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Parent Phone Number
                </label>
                <div className="flex space-x-2">
                  <div className="relative w-32">
                    <select
                      value={formData.parentCountryCode}
                      onChange={(e) => handleChange(e.target.value, "parentCountryCode")}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none appearance-none bg-white"
                    >
                      <option value="+1">+1 (USA)</option>
                      <option value="+91">+91 (India)</option>
                      <option value="+44">+44 (UK)</option>
                      <option value="+61">+61 (AU)</option>
                      <option value="+81">+81 (JP)</option>
                    </select>
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      value={formData.studentParentsNumber}
                      onChange={(e) => handleChange(e.target.value.replace(/\D/, ""), "studentParentsNumber")}
                      maxLength={10}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                      placeholder="Parent's phone number"
                    />
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </div>
                {errors.studentParentsNumber && (
                  <p className="text-red-600 text-sm mt-1">{errors.studentParentsNumber}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center group text-lg mt-8"
                disabled={loading}
              >
                {studentData ? "Update Student" : "Complete Registration"}
                <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}