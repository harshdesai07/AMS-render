import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import CollegeDashboard from "./components/Dashboards/CollegeDashboard";
import FacultyDashboard from "./components/Dashboards/FacultyDashboard";
import HodDashboard from "./components/Dashboards/HodDashboard";
import StudentDashboard from "./components/Dashboards/StudentDashboard";
import HomePage from "./components/Home/HomePage";
import CourseDepartment from "./components/academicManagement/CourseDepartment";
import FacultySubject from "./components/academicManagement/FacultySubject";
import FacultyTaskScheduler from "./components/academicManagement/FacultyTaskScheduler";
import SemesterSubject from "./components/academicManagement/SemesterSubject";
import CollegeLogin from "./components/forms/CollegeLogin";
import CollegeRegistration from "./components/forms/CollegeRegistration";
import FacultyLogin from "./components/forms/FacultyLogin";
import FacultyRegistration from "./components/forms/FacultyRegistration";
import HodRegistration from "./components/forms/HodRegistration";
import StudentLogin from "./components/forms/StudentLogin";
import StudentRegistration from "./components/forms/StudentRegistration";
import PasswordUpdate from "./components/forms/PasswordUpdate";
import AttendanceManagement from "./components/academicManagement/AttendanceManagement";
import Assignments from "./components/academicManagement/Assignments";
import StudentAssignment from "./components/academicManagement/StudentAssignment";
import StudentAttendance from "./components/academicManagement/StudentAttendance";
import ForgotPassword from "./components/forms/ForgotPassword";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<CollegeRegistration />} />
        <Route path="/collegeLogin" element={<CollegeLogin />} />
        <Route path="/facultyLogin" element={<FacultyLogin />} />
        <Route path="/studentLogin" element={<StudentLogin />} />
        <Route path="/collegeDashboard" element={<CollegeDashboard />} />
        <Route path="/hodRegistration" element={<HodRegistration />} />
        <Route path="/facultyRegistration" element={<FacultyRegistration />} />
        <Route path="/facultyDashboard" element={<FacultyDashboard />} />
        <Route path="/StudentDashboard" element={<StudentDashboard />} />
        <Route path="/studentRegistration" element={<StudentRegistration />} />
        <Route path="/studentRegistration/:studentId" element={<StudentRegistration />} />
        <Route path="/hodRegistration/:facultyId" element={<HodRegistration />} />
        <Route path="/facultyRegistration/:facultyId" element={<FacultyRegistration />} />
        <Route path="/CourseDepartment" element={<CourseDepartment />} />
        <Route path="/hodDashboard" element={<HodDashboard />} />
        <Route path="/semesterSubject" element={<SemesterSubject />} />
        <Route path="assign-subject/:facultyId" element={<FacultySubject />} />
        <Route path="facultyTaskScheduler" element={<FacultyTaskScheduler />} />
        <Route path="/faculty/tasks" element={<FacultyTaskScheduler />} />
        <Route path="/update-password" element={<PasswordUpdate />} />
        <Route path="/faculty/attendance" element={<AttendanceManagement />} />
        <Route path="/faculty/assignments" element={<Assignments />} />
        <Route path="/student/assignments" element={<StudentAssignment />} />
        <Route path="/student/attendance" element={<StudentAttendance />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}
