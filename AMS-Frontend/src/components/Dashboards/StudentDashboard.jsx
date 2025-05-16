import {
  ClipboardList,
  FileText,
  Calendar,
  UploadCloud
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../ui/Card";
import AccountDropdown from "../ui/AccountDropdown";

// Mocked Logged-in Student Data (Replace with API call)
const loggedInStudent = {
  id: 1,
  name: "Alice Johnson",
  semester: "Semester 1",
  department: "Computer Science",
};

// Mocked Attendance Data (Replace with API)
const attendanceData = {
  "Semester 1": {
    subjects: {
      "Mathematics": { totalClasses: 20, attended: 18 },
      "Physics": { totalClasses: 22, attended: 19 },
      "Computer Science": { totalClasses: 25, attended: 20 },
      "Chemistry": { totalClasses: 18, attended: 15 },
    },
  },
  "Semester 2": {
    subjects: {
      "Mathematics": { totalClasses: 20, attended: 16 },
      "Physics": { totalClasses: 21, attended: 18 },
      "Computer Science": { totalClasses: 23, attended: 21 },
      "Chemistry": { totalClasses: 19, attended: 14 },
    },
  },
};

export default function StudentDashboard() {
  const [attendance, setAttendance] = useState(null);
  const [overallPercentage, setOverallPercentage] = useState(0);

  const name = sessionStorage.getItem("studentName");
  const token = sessionStorage.getItem("studentToken");
  const semester = sessionStorage.getItem("studentSemester");
  const department = sessionStorage.getItem("studentDepartment");

  const navigate = useNavigate();

  useEffect(() => {
    // Get attendance for logged-in student's semester
    const semesterData = attendanceData[loggedInStudent.semester];
    if (semesterData) {
      setAttendance(semesterData.subjects);

      // Calculate total percentage
      let totalClasses = 0;
      let totalAttended = 0;
      Object.values(semesterData.subjects).forEach(({ totalClasses: tc, attended: ta }) => {
        totalClasses += tc;
        totalAttended += ta;
      });

      const percentage = totalClasses > 0 ? ((totalAttended / totalClasses) * 100).toFixed(2) : 0;
      setOverallPercentage(percentage);
    }
  }, []);

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-auto">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm p-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Student Dashboard</h2>
            <AccountDropdown userRole='STUDENT' />
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="p-6 space-y-6">
          {/* Welcome & Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">Welcome</h3>
                <ClipboardList className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600">{name || loggedInStudent.name}</p>
              <p className="text-sm text-gray-600 mt-2">{department || loggedInStudent.department} • {semester || loggedInStudent.semester}</p>
            </div>

            {/* Assignments view/upload */}
            <button
              onClick={() => navigate('/student/assignments')}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-4 cursor-pointer group"
            >
              <div className="bg-purple-100 p-3 rounded-lg transition-all duration-200 group-hover:bg-purple-200">
                <UploadCloud className="w-6 h-6 text-purple-600 transition-all duration-200 group-hover:scale-110" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-800">Assignments</h3>
                <p className="text-sm text-gray-600">View and upload your assignments</p>
              </div>
            </button>
            
            <button
              onClick={() => navigate('/student/attendance')}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-4 cursor-pointer group"
            >
              <div className="bg-blue-100 p-3 rounded-lg transition-all duration-200 group-hover:bg-blue-200">
                <Calendar className="w-6 h-6 text-blue-600 transition-all duration-200 group-hover:scale-110" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-800">Attendance</h3>
                <p className="text-sm text-gray-600">Check your attendance record</p>
              </div>
            </button>
            {/* <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">Overall Attendance</h3>
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <p className={`text-3xl font-bold ${overallPercentage >= 75 ? "text-green-600" : "text-red-600"}`}>{overallPercentage}%</p>
              <p className={`text-sm mt-2 font-medium ${overallPercentage >= 75 ? "text-green-600" : "text-red-600"}`}>
                {overallPercentage >= 75 ? "Eligible for exams" : "Low attendance!"}
              </p>
            </div> */}
            {/* <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">Assignments</h3>
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-purple-600">--</p>
              <p className="text-sm text-gray-600 mt-2">View & upload assignments</p>
            </div> */}
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
          </div>

          {/* Attendance List
          <div id="attendance-section" className="mt-4">
            <h3 className="text-lg font-bold mb-2">Your Attendance</h3>
            {attendance ? (
              <div className="space-y-4">
                {Object.entries(attendance).map(([subject, { totalClasses, attended }]) => (
                  <Card key={subject} className="w-full">
                    <CardContent className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                      <span className="text-center sm:text-left font-semibold">{subject}</span>
                      <span className="text-sm text-gray-600">
                        {attended} / {totalClasses} classes attended
                      </span>
                      <span
                        className={`px-4 py-1 rounded text-sm font-semibold ${
                          (attended / totalClasses) * 100 >= 75
                            ? "bg-green-400 text-green-800"
                            : "bg-red-400 text-red-800"
                        }`}
                      >
                        {((attended / totalClasses) * 100).toFixed(2)}%
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No attendance records found.</p>
            )}
          </div> */}
        </main>
      </div>
    </div>
  );
}