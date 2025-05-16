import axios from 'axios';
import {
  Eye,
  Upload,
  BookOpen,
  GraduationCap,
  UserPlus,
  ChevronDown,
  School,
  FolderOpen,
  Layers,
  Award
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CollegeDataTable from "../data/CollegeDataTable";
import AccountDropdown from '../ui/AccountDropdown';

export default function CollegeDashboard() {
  const navigate = useNavigate();
  const [viewType, setViewType] = useState(null);
  const collegeId = sessionStorage.getItem("collegeId");
  const collegeName = sessionStorage.getItem("collegeName");
  const token = sessionStorage.getItem("collegeToken");
  const [isFacultyOpen, setIsFacultyOpen] = useState(false);
  const [hasCourses, setHasCourses] = useState(false);
  const [courses, setCourses] = useState([]);
  const facultyDropdownRef = useRef(null);
  const [stats, setStats] = useState({
    totalDepartments: 0,
    totalHods: 0,
    totalCourses: 0,
    accreditedPrograms: 0
  });

useEffect(() => {
  const fetchCollegeData = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/getCollegeStats/${collegeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = res.data;

      setStats({
        totalDepartments: data.departmentCount || 0,
        totalHods: data.hodCount || 0,
        totalCourses: data.courseCount || 0,
      });

    } catch (error) {
      console.error('Error fetching college data:', error);
    }
  };

  fetchCollegeData();
}, [collegeId, token]);


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesResponse = await axios.get(
          `http://localhost:8080/courses/${collegeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (coursesResponse.status === 200 && coursesResponse.data && coursesResponse.data.length > 0) {
          setCourses(coursesResponse.data);
          setHasCourses(true);
        } else {
          setHasCourses(false);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setHasCourses(false);
        } else {
          console.error('Error fetching courses:', error);
          setHasCourses(false);
        }
      }
    };

    fetchCourses();
  }, [collegeId, token]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (facultyDropdownRef.current && !facultyDropdownRef.current.contains(event.target)) {
        setIsFacultyOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNoRecords = (type) => {
    const typeText = type === "faculty" ? "HOD" : "Course & Department";
    toast.error(`No ${typeText} found. Please add ${typeText} first.`);
  };

  const handleFileUpload = async (event, type) => {
    if (!hasCourses) {
      toast.error('Please add courses first');
      event.target.value = '';
      return;
    }

    if (!event.target.files || event.target.files.length === 0) {
      console.error("No file selected.");
      return;
    }
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    const fileType = file.type;

    if (validTypes.includes(fileType)) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const endpoint = `http://localhost:8080/uploadFacultyExcel/${collegeId}`;

        const response = await axios.post(
          endpoint,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          toast.success('Faculty data uploaded successfully! Processing...');
          setTimeout(() => {
            toast.success('Faculty data processed successfully!');
          }, 2000);
        } else {
          toast.error('File upload failed. Please try again.');
        }
      } catch (error) {
        toast.error('Error uploading file: ' + error.message);
      }
    } else {
      toast.error('Please upload only Excel files (.xls or .xlsx)');
      event.target.value = '';
    }
  };

  const handleNavigation = (path) => {
    if (!hasCourses) {
      toast.error('Please add courses first');
      return;
    }
    navigate(path, {
      state: {
        userRole: "COLLEGE",
        courses: courses
      }
    });
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      <Toaster position="top-center" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-auto">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm p-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <School className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-800">{collegeName}</h2>
                <p className="text-sm text-gray-600">College Dashboard</p>
              </div>
            </div>

            <AccountDropdown userRole='COLLEGE' />
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="p-6 space-y-6">
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Total HODs Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">HODs</h3>
                <GraduationCap className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-purple-600">{stats.totalHods}</p>
              <p className="text-sm text-gray-600 mt-2">Heads of Departments</p>
            </div>

           

            

            {/* Total Courses Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold text-gray-800">Courses & Departments</h3>
    <BookOpen className="w-6 h-6 text-orange-600" />
  </div>
  
  <div className="grid grid-cols-2 gap-6">
    <div>
      <p className="text-3xl font-bold text-orange-600">{stats.totalCourses}</p>
      <p className="text-sm text-gray-600">Total Courses</p>
    </div>
    <div>
      <p className="text-3xl font-bold text-orange-600">{stats.totalDepartments}</p>
      <p className="text-sm text-gray-600">Departments</p>
    </div>
  </div>
</div>

            
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {/* Faculty Actions */}
            <div className="relative" ref={facultyDropdownRef}>
              <button
                className={`bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-4 w-full ${!hasCourses ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                onClick={() => {
                  if (hasCourses) {
                    setIsFacultyOpen(!isFacultyOpen);
                  }
                }}
                title={!hasCourses ? "Please add courses first" : ""}
              >
                <div className="bg-purple-100 p-3 rounded-lg transition-all duration-200 group-hover:bg-purple-200 ">
                  <UserPlus className="w-6 h-6 text-purple-600 transition-all duration-200 group-hover:scale-110" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">Add HOD</h3>
                  <p className="text-sm text-gray-600">Register or upload </p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isFacultyOpen ? 'rotate-180' : ''}`} />
              </button>
              {isFacultyOpen && hasCourses && (
                <div className="absolute left-0 mt-2 w-full bg-white rounded-lg shadow-xl border overflow-hidden z-50">
                  <button
                    className="w-full px-4 py-3 text-left text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors flex items-center cursor-pointer"
                    onClick={() => {
                      setIsFacultyOpen(false);
                      handleNavigation(`/hodRegistration/${collegeId}`);
                    }}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    HOD Registration
                  </button>
                  <label className="relative w-full flex items-center justify-center cursor-pointer">
                    <input
                      type="file"
                      accept=".xls,.xlsx"
                      onChange={(e) => handleFileUpload(e, 'faculty')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="w-full px-4 py-3 text-left text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors flex items-center">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Excel
                    </div>
                  </label>
                </div>
              )}
            </div>

             {/* Course & Department */}
             <button
              onClick={() => navigate('/courseDepartment')}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-4 cursor-pointer group"
            >
              <div className="bg-amber-100 p-3 rounded-lg transition-all duration-200 group-hover:bg-amber-200">
                <BookOpen className="w-6 h-6 text-amber-600 transition-all duration-200 group-hover:scale-110" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-800">Course & Dept</h3>
                <p className="text-sm text-gray-600">Manage departments</p>
              </div>
            </button>

           {/* View Hod */}
           <button
              onClick={() => setViewType((prev) => (prev === "faculty" ? null : "faculty"))}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-4 cursor-pointer group"
            >
              <div className="bg-purple-100 p-3 rounded-lg transition-all duration-200 group-hover:bg-purple-200">
                <Eye className="w-6 h-6 text-purple-600 transition-all duration-200 group-hover:scale-110" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-800">View HOD</h3>
                <p className="text-sm text-gray-600">Access HOD records</p>
              </div>
            </button>

               {/* View Course Department */}
               <button
              onClick={() => setViewType((prev) => (prev === "courseDepartment" ? null : "courseDepartment"))}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-4 cursor-pointer group"
            >
              <div className="bg-amber-100 p-3 rounded-lg transition-all duration-200 group-hover:bg-amber-200">
                <FolderOpen className="w-6 h-6 text-amber-600 transition-all duration-200 group-hover:scale-110" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-800">View Courses & Departments</h3>
                <p className="text-sm text-gray-600">Browse all courses & departments</p>
              </div>
            </button>
          </div>

          {/* View Section */}
          {viewType && (
            <div className="shadow-sm">
              <CollegeDataTable
                type={viewType}
                collegeId={collegeId}
                onNoRecords={handleNoRecords}
                token={token}
                userRole="COLLEGE"
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}