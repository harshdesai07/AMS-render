import {
  Calendar,
  Menu,
  ClipboardList,
  FileText,
  CheckCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AccountDropdown from '../ui/AccountDropdown';
import axios from "axios";

export default function FacultyDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const facultyName = sessionStorage.getItem("facultyName");
  const token = sessionStorage.getItem("facultyToken");
  const collegeId = sessionStorage.getItem("facultyCollegeId");
  const facultyId = sessionStorage.getItem("facultyId");
  const courseName = sessionStorage.getItem("facultyCourse");
  const departmentName = sessionStorage.getItem("facultyDepartment");

  const [stats, setStats] = useState({
    totalStudents: undefined,
    pendingTasks: undefined,
    assignments: undefined,
  });

  // Fetch stats on mount
  useEffect(() => {
    const fetchFacultyStats = async () => {
      try {
        const response = await axios.get('http://localhost:8080/getFacultyStats/FACULTY', {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          params: {
            collegeId: collegeId,
            facultyId: facultyId, 
            courseName: courseName,
            departmentName: departmentName,
          },
        });

        if(response.status !== 200) {
          throw new Error("Failed to fetch stats");
        }
        setStats({
          totalStudents: response.data.studentCount,
          pendingTasks: response.data.taskCount,
          assignments: response.data.assignmentCount,
        });
      } catch (error) {
        // Optionally handle/log error
        console.error("Error fetching faculty stats:", error);
        setStats({
          totalStudents: "-",
          pendingTasks: "-",
          assignments: "-",
        });
      }
    };

    if (token) {
      fetchFacultyStats();
    }
  }, [token]);

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      <Toaster position="top-center" />
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-auto">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm p-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <button
              className="md:hidden text-gray-600 hover:bg-gray-100 p-2 rounded-lg cursor-pointer"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center">
              <h2 className="text-xl font-bold text-gray-800">Faculty Dashboard</h2>
              {/* Faculty Name & Department in header */}
              <span className="text-sm text-gray-600 mt-1">
                {facultyName ? facultyName : "Faculty"}{departmentName ? ` | ${departmentName}` : ""}
              </span>
            </div>

            <AccountDropdown userRole='FACULTY' />

          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="p-6 space-y-6">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">Total Students</h3>
                <ClipboardList className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600">{stats.totalStudents ?? "-"}</p>
              <p className="text-sm text-gray-600 mt-2">Your assigned students</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">Pending Tasks</h3>
                <CheckCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <p className="text-3xl font-bold text-yellow-600">{stats.pendingTasks ?? "-"}</p>
              <p className="text-sm text-gray-600 mt-2">Tasks to complete</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">Assignments</h3>
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-purple-600">{stats.assignments ?? "-"}</p>
              <p className="text-sm text-gray-600 mt-2">New submissions</p>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Attendance */}
            <button
              onClick={() => navigate('/faculty/attendance')}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-4 cursor-pointer group"
            >
              <div className="bg-blue-100 p-3 rounded-lg transition-all duration-200 group-hover:bg-blue-200">
                <Calendar className="w-6 h-6 text-blue-600 transition-all duration-200 group-hover:scale-110" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-800">Attendance</h3>
                <p className="text-sm text-gray-600">Manage student attendance</p>
              </div>
            </button>

            {/* Tasks */}
            <button
              onClick={() => navigate('/faculty/tasks', { state: { userRole: 'FACULTY' } })}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-4 cursor-pointer group"
            >
              <div className="bg-amber-100 p-3 rounded-lg transition-all duration-200 group-hover:bg-amber-200">
                <CheckCircle className="w-6 h-6 text-amber-600 transition-all duration-200 group-hover:scale-110" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-800">Tasks</h3>
                <p className="text-sm text-gray-600">View and manage tasks</p>
              </div>
            </button>

            {/* Assignments */}
            <button
              onClick={() => navigate('/faculty/assignments')}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-4 cursor-pointer group"
            >
              <div className="bg-purple-100 p-3 rounded-lg transition-all duration-200 group-hover:bg-purple-200">
                <FileText className="w-6 h-6 text-purple-600 transition-all duration-200 group-hover:scale-110" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-800">Assignments</h3>
                <p className="text-sm text-gray-600">Create and grade assignments</p>
              </div>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}