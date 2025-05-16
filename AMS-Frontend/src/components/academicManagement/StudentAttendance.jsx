import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, BarChart3, BookOpen, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CloseButton from '../ui/CloseButton';

// Utility functions
const calculateAttendancePercentage = (subject) => {
  if (subject.totalClasses === 0) return 0;
  return Math.round((subject.attendedClasses / subject.totalClasses) * 100);
};
 

const getAttendanceStatus = (percentage) => {
  if (percentage >= 90) return 'excellent';
  if (percentage >= 80) return 'good';
  if (percentage >= 75) return 'average';
  if (percentage >= 65) return 'poor';
  return 'critical';
};

const getStatusColor = (status) => {
  switch (status) {
    case 'excellent': return 'bg-gradient-to-r from-green-200 to-teal-300';
    case 'good': return 'bg-gradient-to-r from-blue-200 to-blue-400';
    case 'average': return 'bg-gradient-to-r from-yellow-200 to-yellow-400';
    case 'poor': return 'bg-gradient-to-r from-orange-200 to-orange-400';
    case 'critical': return 'bg-gradient-to-r from-red-300 to-pink-400';
    default: return 'bg-gradient-to-r from-gray-200 to-gray-400';
  }
};

const getStatusTextColor = (status) => {
  switch (status) {
    case 'excellent': return 'text-green-700';
    case 'good': return 'text-blue-700';
    case 'average': return 'text-yellow-700';
    case 'poor': return 'text-orange-700';
    case 'critical': return 'text-red-700';
    default: return 'text-gray-700';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'excellent': return 'Excellent';
    case 'good': return 'Good';
    case 'average': return 'Average';
    case 'poor': return 'Poor';
    case 'critical': return 'Critical';
    default: return 'Unknown';
  }
};

const calculateOverallAttendance = (subjects) => {
  if (subjects.length === 0) return 0;
  const totalClasses = subjects.reduce((sum, subject) => sum + subject.totalClasses, 0);
  const attendedClasses = subjects.reduce((sum, subject) => sum + subject.attendedClasses, 0);
  if (totalClasses === 0) return 0;
  return Math.round((attendedClasses / totalClasses) * 100);
};

const calculateClassesNeeded = (subject, targetPercentage = 75) => {
  const currentPercentage = calculateAttendancePercentage(subject);
  if (currentPercentage >= targetPercentage) return 0;
  const classesNeeded = Math.ceil(
    (targetPercentage * subject.totalClasses - 100 * subject.attendedClasses) /
      (100 - targetPercentage)
  );
  return Math.max(0, classesNeeded);
};

const sortSubjectsByAttendance = (subjects, ascending = true) => {
  return [...subjects].sort((a, b) => {
    const percentageA = calculateAttendancePercentage(a);
    const percentageB = calculateAttendancePercentage(b);
    return ascending ? percentageA - percentageB : percentageB - percentageA;
  });
};

const subjectColors = [
  'linear-gradient(90deg, #93c5fd 0%, #67e8f9 100%)',
  'linear-gradient(90deg, #86efac 0%, #a5f3fc 100%)',
  'linear-gradient(90deg, #d8b4fe 0%, #a5b4fc 100%)',
  'linear-gradient(90deg, #fcd34d 0%, #fdba74 100%)',
  'linear-gradient(90deg, #fca5a5 0%, #f87171 100%)',
  'linear-gradient(90deg, #67e8f9 0%, #7dd3fc 100%)',
  'linear-gradient(90deg, #fef3c7 0%, #fde68a 100%)',
  'linear-gradient(90deg, #f5d0fe 0%, #d8b4fe 100%)'
];

// Components
const AttendanceCard = ({ subject }) => {
  const attendancePercentage = calculateAttendancePercentage(subject);
  const status = getAttendanceStatus(attendancePercentage);
  const statusColor = getStatusColor(status);
  const statusLabel = getStatusLabel(status);
  const classesNeeded = calculateClassesNeeded(subject);
  const progressBarWidth = `${Math.min(100, attendancePercentage)}%`;

  return (
    
    <div className="rounded-3xl bg-white/80 backdrop-blur-sm shadow-md border border-gray-200 overflow-hidden flex flex-col hover:scale-[1.025] transition-transform duration-300 group">
      <div className="h-2 w-full" style={{ background: subject.color || '#93c5fd' }} />
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h3 className="font-bold text-lg text-gray-800 tracking-tight">{subject.name}</h3>
            <p className="text-xs font-semibold text-gray-500 tracking-widest uppercase">{subject.code}</p>
          </div>
          <div
            className={`py-1 px-4 rounded-xl text-xs font-semibold border shadow-sm
            ${status === 'critical' || status === 'poor'
              ? 'bg-red-50 text-red-800 border-red-100'
              : status === 'average'
                ? 'bg-yellow-50 text-yellow-800 border-yellow-100'
                : 'bg-green-50 text-green-800 border-green-100'}
            `}
          >
            {statusLabel}
          </div>
        </div>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-gray-500">Attendance</span>
            <span className={`text-xl font-extrabold ${getStatusTextColor(status)}`}>{attendancePercentage}%</span>
          </div>
          <div className="relative h-3 rounded-full bg-gray-100 overflow-hidden shadow-inner">
            <div
              className={`absolute left-0 top-0 h-full rounded-full ${statusColor} transition-all duration-1000`}
              style={{ width: progressBarWidth, minWidth: '5%' }}
            />
            <div className="absolute left-0 top-0 h-full w-full" />
          </div>
        </div>
        <div className="flex justify-between items-center text-xs mt-auto">
          <span className="text-gray-600 font-semibold">
            <span className="font-extrabold">{subject.attendedClasses}</span> / {subject.totalClasses} classes
          </span>
          {attendancePercentage < 75 ? (
            <span className="flex items-center text-red-700 font-semibold">
              <AlertTriangle size={15} className="mr-1" />
              Need {classesNeeded} more
            </span>
          ) : (
            <span className="flex items-center text-green-700 font-semibold">
              <CheckCircle size={15} className="mr-1" />
              Adequate
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const AttendanceSummary = ({
  studentName,
  studentId,
  subjects,
  onSort,
  sortAscending
}) => {
  const overallAttendance = calculateOverallAttendance(subjects);
  const overallStatus = getAttendanceStatus(overallAttendance);
  const statusColor = getStatusColor(overallStatus);

  const totalClasses = subjects.reduce((sum, subject) => sum + subject.totalClasses, 0);
  const attendedClasses = subjects.reduce((sum, subject) => sum + subject.attendedClasses, 0);

  const subjectsWithLowAttendance = subjects.filter(
    subject => {
      const status = getAttendanceStatus(calculateAttendancePercentage(subject));
      return status === 'critical' || status === 'poor';
    }
  ).length;

  return (
    <div className="rounded-3xl bg-white/90 shadow-md border border-gray-200 p-8 mb-12 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10">
        <div>
          <h2 className="text-[2.5rem] font-black text-gray-800 tracking-tight leading-tight flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-600 via-green-500 to-sky-500 text-transparent bg-clip-text">
              {studentName}
            </span>
          </h2>
          <div className="mt-1 text-base font-medium text-gray-500">
            ID: <span className="font-bold">{studentId}</span>
          </div>
        </div>
        <div>
          <button
            onClick={onSort}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-50 via-green-50 to-sky-100 hover:from-blue-100 hover:via-green-100 hover:to-sky-200 text-blue-800 font-bold px-5 py-3 rounded-2xl shadow-sm border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
          >
            <BarChart3 size={20} className="text-blue-600" />
            Sort by {sortAscending ? 'Highest' : 'Lowest'} Attendance
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white/80 rounded-2xl p-7 shadow-sm border border-gray-200 flex flex-col items-start">
          <div className="flex items-center mb-4">
            <div className={`p-2 rounded-full ${statusColor} bg-opacity-20 mr-3`}>
              <BarChart3 className={statusColor.replace('bg-gradient-to-r ', 'text-').replace('200', '600').replace('300', '700').replace('400', '700')} size={24} />
            </div>
            <h3 className="font-bold text-gray-700">Overall Attendance</h3>
          </div>
          <div className="flex items-end">
            <span className={`text-4xl font-black ${getStatusTextColor(overallStatus)}`}>{overallAttendance}%</span>
            <span className="ml-2 text-sm text-gray-500 pb-1">of all classes</span>
          </div>
          <div className="mt-4 h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner w-full">
            <div className={`h-full rounded-full ${statusColor} transition-all duration-1000`} style={{ width: `${overallAttendance}%` }} />
          </div>
        </div>
        <div className="bg-white/80 rounded-2xl p-7 shadow-sm border border-gray-200 flex flex-col items-start">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-full bg-blue-50 mr-3">
              <BookOpen className="text-blue-600" size={24} />
            </div>
            <h3 className="font-bold text-gray-700">Classes Attended</h3>
          </div>
          <div className="flex items-end">
            <span className="text-4xl font-black text-blue-800">{attendedClasses}</span>
            <span className="ml-2 text-sm text-gray-500 pb-1">of {totalClasses} total</span>
          </div>
          <div className="mt-4 h-3 bg-blue-100 rounded-full overflow-hidden shadow-inner w-full">
            <div className="h-full bg-blue-400 rounded-full transition-all duration-1000" style={{ width: `${(attendedClasses / (totalClasses || 1)) * 100}%` }} />
          </div>
        </div>
        <div className="bg-white/80 rounded-2xl p-7 shadow-sm border border-gray-200 flex flex-col items-start">
          <div className="flex items-center mb-4">
            <div className={`p-2 rounded-full ${
              subjectsWithLowAttendance > 0 ? 'bg-red-50' : 'bg-green-50'
            } mr-3`}>
              <Users className={subjectsWithLowAttendance > 0 ? 'text-red-600' : 'text-green-600'} size={24} />
            </div>
            <h3 className="font-bold text-gray-700">Subjects at Risk</h3>
          </div>
          <div className="flex items-end">
            <span className={`text-4xl font-black ${subjectsWithLowAttendance > 0 ? 'text-red-800' : 'text-green-800'}`}>{subjectsWithLowAttendance}</span>
            <span className="ml-2 text-sm text-gray-500 pb-1">of {subjects.length} subjects</span>
          </div>
          <div className="mt-4">
            {subjectsWithLowAttendance > 0 ? (
              <p className="text-xs text-red-700 rounded-lg px-2 py-1 bg-red-50 inline-block mt-1 transition-all">Attendance below 75% threshold</p>
            ) : (
              <p className="text-xs text-green-700 rounded-lg px-2 py-1 bg-green-50 inline-block mt-1">All subjects have adequate attendance</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentAttendance = () => {
  const [sortAscending, setSortAscending] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
const handleClose = () => {
  navigate(-1);  // this takes you back to the previous page
};

  // Example API endpoint, replace with your actual endpoint
  const API_URL = 'http://localhost:8080/getAttendanceCount';
  const params = new URLSearchParams({
    studentId: sessionStorage.getItem('studentId'),
    semester: sessionStorage.getItem('studentSemester'),
  });
  const token = sessionStorage.getItem('studentToken');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}?${params}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();

        // If your backend returns an array of arrays as described
        // [
        //   ["Mathematics-I", "0", "0"],
        //   ["Physics", "1", "1"],
        //   ...
        // ]
        // If you have meta info (name, roll, etc.) in the response, extract it; else use placeholders.
        // If it's only an array, adapt accordingly.

        // If response IS just the array:
        const attendanceArray = Array.isArray(data) ? data : data.attendance || [];

        const subjects = attendanceArray.map((arr, idx) => ({
          id: String(idx + 1),
          name: arr[0],
          code: `SUB-${idx + 1}`,
          totalClasses: Number(arr[1]),
          attendedClasses: Number(arr[2]),
          color: subjectColors[idx % subjectColors.length]
        }));

        setStudentData({
          id: sessionStorage.getItem('studentRollNumber'),
          name: sessionStorage.getItem('studentName'),
          subjects,
        });
      } catch (error) {
        console.error('Failed to fetch attendance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line
  }, []);

  const handleSort = () => {
    setSortAscending(!sortAscending);
  };

  if (loading) {
    return <div className="w-full min-h-screen flex items-center justify-center text-lg font-bold text-blue-700">Loading attendance...</div>;
  }

  if (!studentData) {
    return <div className="w-full min-h-screen flex items-center justify-center text-lg font-bold text-red-700">Failed to load attendance data.</div>;
  }

  const sortedSubjects = sortSubjectsByAttendance(studentData.subjects, sortAscending);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-2 sm:px-4 flex flex-col items-center">
      {/* Close Button */}
                <div className="absolute top-4 right-4 z-10">
                  <CloseButton onClick={handleClose} />
                </div>
      
      <AttendanceSummary
        studentName={studentData.name}
        studentId={studentData.id}
        subjects={studentData.subjects}
        onSort={handleSort}
        sortAscending={sortAscending}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-7xl">
        {sortedSubjects.map((subject) => (
          <AttendanceCard key={subject.id} subject={subject} />
        ))}
      </div>
      <footer className="mt-16 text-center text-xs text-gray-500 font-semibold tracking-widest">
        &copy; {new Date().getFullYear()} NextGen Attendance Portal &mdash; Designed for 2025+
      </footer>
    </div>
  );
};

export default StudentAttendance;