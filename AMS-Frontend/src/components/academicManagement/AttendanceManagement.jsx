import axios from 'axios';
import { Calendar, Check, Download, PieChart, Save, Search, UserCheck, Users, UserX, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import CloseButton from '../ui/CloseButton';

const AttendanceManagement = () => {
    const baseUrl = 'http://localhost:8080';
    const userDepartment = sessionStorage.getItem('facultyDepartment');
    const departmentName = sessionStorage.getItem('facultyDepartment');
    const course = sessionStorage.getItem('facultyCourse');
    const collegeId = sessionStorage.getItem('facultyCollegeId');
    const token = sessionStorage.getItem('facultyToken');
    const facultyId = sessionStorage.getItem('facultyId');

    const [semesters, setSemesters] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);
    const [isLoadingSemesters, setIsLoadingSemesters] = useState(true);
    const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
    const [isLoadingStudents, setIsLoadingStudents] = useState(false);
    const [semesterError, setSemesterError] = useState(null);
    const [subjectError, setSubjectError] = useState(null);
    const [studentError, setStudentError] = useState(null);
    const [selectedSemesterNumber, setSelectedSemesterNumber] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    // State for attendance
    const today = new Date().toISOString().split('T')[0];
    const [attendanceRecords, setAttendanceRecords] = useState([]);

    // State for UI
    const [isSaving, setIsSaving] = useState(false);

    // Fetch semesters from backend
    useEffect(() => {
        const fetchSemesters = async () => {
            try {
                setIsLoadingSemesters(true);
                setSemesterError(null);

                const response = await axios.get(`${baseUrl}/getSemester/${course}`);
                setSemesters(response.data);
            } catch (error) {
                console.error('Error fetching semesters:', error);
                setSemesterError('Failed to load semesters. Please try again later.');
            } finally {
                setIsLoadingSemesters(false);
            }
        };

        fetchSemesters();
    }, [course]);

    // Fetch subjects when semester is selected
    useEffect(() => {
        const fetchSubjects = async () => {
            if (!selectedSemesterNumber) {
                setSubjects([]);
                return;
            }
    
            try {
                setIsLoadingSubjects(true);
                setSubjectError(null);
                const response = await axios.get(`${baseUrl}/subjectsByFaculty`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        facultyId: facultyId,
                        courseName: course,
                        departmentName: departmentName,
                        semester: selectedSemesterNumber
                    }
                });
                
                setSubjects(response.data);
                
                if (response.data.length === 0) {
                    toast.info('No subjects assigned to this faculty for the selected criteria', {
                        position: "top-right",
                        autoClose: 5000,
                    });
                } 
                
            } catch (error) {
                console.error('Error fetching subjects:', error);
                setSubjectError('Failed to load subjects. Please try again later.');
                toast.error('Failed to load subjects. Please try again later.', {
                    position: "top-right",
                    autoClose: 5000,
                });
            } finally {
                setIsLoadingSubjects(false);
            }
        };
    
        fetchSubjects();
    }, [selectedSemesterNumber, facultyId, course, departmentName, token]);

    // Handle semester change
    const handleSemesterChange = (e) => {
        const newSemester = e.target.value;
        setSelectedSemesterNumber(newSemester);
        setSelectedSubject('');
        setStudents([]);
        setAttendanceRecords([]);
    };

    // Handle subject change
    const handleSubjectChange = (e) => {
        setSelectedSubject(e.target.value);
    };

    // Fetch students when semester is selected
    useEffect(() => {
        const fetchStudents = async () => {
            if (!selectedSemesterNumber) {
                setStudents([]);
                setAttendanceRecords([]);
                return;
            }

            try {
                setIsLoadingStudents(true);
                setStudentError(null);
                const response = await axios.get(`${baseUrl}/getstudent/${collegeId}/FACULTY`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        courseName: course,
                        departmentName: departmentName,
                        semester: selectedSemesterNumber
                    }
                });
                setStudents(response.data);
            } catch (error) {
                console.error('Error fetching students:', error);
                setStudentError('Failed to load students. Please try again later.');
            } finally {
                setIsLoadingStudents(false);
            }
        };

        fetchStudents();
    }, [selectedSemesterNumber, userDepartment]);

    const handleClose = () => {
        navigate(-1);
    };

    // Initialize attendance records for the selected date
    useEffect(() => {
        const newRecords = students
            .filter(student => !userDepartment || student.deptName === userDepartment)
            .map(student => ({
                studentId: student.studentId,
                date: today,
                status: null
            }));

        setAttendanceRecords(newRecords);
    }, [students, userDepartment, today, selectedSemesterNumber]);

    // Filter students based on search query
    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            const matchesSearch = searchQuery
                ? student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
                : true;

            return matchesSearch;
        });
    }, [students, searchQuery]);

    // Get attendance status for a student
    const getAttendanceStatus = (studentId) => {
        const record = attendanceRecords.find(
            record => record.studentId === studentId && record.date === today
        );
        return record ? record.status : null;
    };

    // Handle attendance status change
    const handleAttendanceChange = (studentId, status) => {
        if (!studentId) return;
        setAttendanceRecords(prev => {
            const updatedRecords = [...prev];
            const recordIndex = updatedRecords.findIndex(
                record => record.studentId === studentId && record.date === today
            );

            if (recordIndex >= 0) {
                updatedRecords[recordIndex] = {
                    ...updatedRecords[recordIndex],
                    status
                };
            } else {
                updatedRecords.push({
                    studentId,
                    date: today,
                    status
                });
            }

            return updatedRecords;
        });
    };

    // Calculate attendance statistics
    const attendanceStats = useMemo(() => {
        const present = filteredStudents.filter(
            student => getAttendanceStatus(student.studentId) === 'present'
        ).length;

        const absent = filteredStudents.filter(
            student => getAttendanceStatus(student.studentId) === 'absent'
        ).length;

        const unmarked = filteredStudents.filter(
            student => getAttendanceStatus(student.studentId) === null
        ).length;

        return {
            present,
            absent,
            unmarked,
            total: filteredStudents.length
        };
    }, [filteredStudents, attendanceRecords]);

    const exportCSV = () => {
        const records = filteredStudents.map(student => {
            const status = getAttendanceStatus(student.studentId) || 'unmarked';
            return {
                'Roll Number': student.rollNumber,
                'Name': student.studentName,
                'Department': departmentName,
                'Semester': selectedSemesterNumber,
                'Subject': selectedSubject,
                'Date': new Date(today).toLocaleDateString(),
                'Status': status.charAt(0).toUpperCase() + status.slice(1)
            };
        });

        if (records.length === 0) return;

        const headers = Object.keys(records[0]).join(',');
        const csv = records.map(row => Object.values(row).join(',')).join('\n');
        const blob = new Blob([`${headers}\n${csv}`], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `attendance-${today}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleSaveAttendance = async () => {
        setIsSaving(true);

        try {
            const recordsToSave = attendanceRecords
                .filter(record => record.status !== null)
                .map(record => ({
                    studentId: record.studentId,
                    subject: selectedSubject,
                    status: record.status.toUpperCase(),
                }));

            if (recordsToSave.length === 0) {
                toast.error('No attendance records to save.');
                return;
            }

            const response = await axios.post(
                `${baseUrl}/markAttendance/${facultyId}`,
                recordsToSave,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                // Export CSV after successful save
                exportCSV();
                
                toast.success('Attendance saved and CSV exported successfully!');
                setIsSubmitted(true);
                // Reset all selections and data
                setSelectedSemesterNumber('');
                setSelectedSubject('');
                setStudents([]);
                setAttendanceRecords([]);
                setSearchQuery('');
            }
        } catch (error) {
            console.error('Error saving attendance:', error);
            toast.error(error.response?.data?.message || 'Failed to save attendance');
        } finally {
            setIsSaving(false);
        }
    };

    const formatDisplayDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const resetForm = () => {
        setIsSubmitted(false);
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                <ToastContainer />
                <div className="absolute top-4 right-4 z-10">
                    <CloseButton onClick={handleClose} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Student Attendance Management</h1>

                {!isSubmitted ? (
                    <>
                        <div className="flex items-center text-gray-700 mb-4">
                            <Calendar size={20} className="text-blue-500 mr-2" />
                            <span className="font-medium">{formatDisplayDate(today)}</span>
                        </div>

                        {filteredStudents.length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                                <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                                    <PieChart size={18} className="mr-2 text-blue-500" />
                                    Attendance Summary
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-center p-3 bg-green-50 rounded-md border border-green-100">
                                        <div className="rounded-full p-2 bg-green-100 mr-3">
                                            <UserCheck size={18} className="text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-green-700">Present</p>
                                            <p className="text-lg font-semibold text-green-800">
                                                {attendanceStats.present} <span className="text-sm font-normal text-green-600">({Math.round((attendanceStats.present / attendanceStats.total) * 100)}%)</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center p-3 bg-red-50 rounded-md border border-red-100">
                                        <div className="rounded-full p-2 bg-red-100 mr-3">
                                            <UserX size={18} className="text-red-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-red-700">Absent</p>
                                            <p className="text-lg font-semibold text-red-800">
                                                {attendanceStats.absent} <span className="text-sm font-normal text-red-600">({Math.round((attendanceStats.absent / attendanceStats.total) * 100)}%)</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center p-3 bg-gray-50 rounded-md border border-gray-200">
                                        <div className="rounded-full p-2 bg-gray-100 mr-3">
                                            <Users size={18} className="text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-700">Unmarked</p>
                                            <p className="text-lg font-semibold text-gray-800">
                                                {attendanceStats.unmarked} <span className="text-sm font-normal text-gray-600">({Math.round((attendanceStats.unmarked / attendanceStats.total) * 100)}%)</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center text-gray-700 mb-4 mt-6">
                            <span className="font-medium">Department: {departmentName}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 mt-6">
                            <div className="w-full">
                                <label htmlFor="semester-select" className="block text-sm font-medium text-gray-700 mb-1">
                                    Semester
                                </label>
                                {isLoadingSemesters ? (
                                    <div className="animate-pulse p-2 bg-gray-200 rounded-md">Loading semesters...</div>
                                ) : semesterError ? (
                                    <div className="p-2 text-red-600 text-sm">{semesterError}</div>
                                ) : (
                                    <select
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        value={selectedSemesterNumber}
                                        onChange={handleSemesterChange}
                                    >
                                        <option value="">Select a semester</option>
                                        {semesters.map((semester) => (
                                            <option key={semester.id} value={semester.semesterNumber}>
                                                {semester.semesterNumber}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div className="w-full">
                                <label htmlFor="subject-select" className="block text-sm font-medium text-gray-700 mb-1">
                                    Subject
                                </label>
                                {isLoadingSubjects ? (
                                    <div className="animate-pulse p-2 bg-gray-200 rounded-md">Loading subjects...</div>
                                ) : subjectError ? (
                                    <div className="p-2 text-red-600 text-sm">{subjectError}</div>
                                ) : (
                                    <select
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        value={selectedSubject}
                                        onChange={handleSubjectChange}
                                        disabled={!selectedSemesterNumber}
                                    >
                                        <option value="">Select a subject</option>
                                        {subjects.map((subject) => (
                                            <option key={subject.id} value={subject.name}>
                                                {subject.name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </div>

                        {isLoadingStudents && (
                            <div className="p-4 text-center">
                                <div className="animate-pulse">Loading students...</div>
                            </div>
                        )}

                        {studentError && (
                            <div className="p-4 text-red-600 text-center">{studentError}</div>
                        )}

                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                            <div className="w-full md:w-1/2">
                                <div className="relative w-full">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Search by name or roll number..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="flex space-x-3 items-center">
                                <button
                                    onClick={handleSaveAttendance}
                                    disabled={isSaving || filteredStudents.length === 0 || !selectedSubject || attendanceStats.unmarked > 0}
                                    className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    title={attendanceStats.unmarked > 0 ? "Please mark attendance for all students before saving" : ""}
                                >
                                    {isSaving ? (
                                        <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></span>
                                    ) : (
                                        <>
                                            <Save size={18} className="mr-2" />
                                            <Download size={18} className="mr-2" />
                                        </>
                                    )}
                                    {isSaving ? 'Saving...' : 'Save & Export'}
                                </button>
                                {attendanceStats.unmarked > 0 && (
                                    <span className="text-sm text-red-600">
                                        {attendanceStats.unmarked} student(s) unmarked
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
                            <div className="overflow-x-auto">
                                {filteredStudents.length > 0 ? (
                                    <table className="min-w-full border border-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
                                                    S.No
                                                </th>
                                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
                                                    Roll Number
                                                </th>
                                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
                                                    Name
                                                </th>
                                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
                                                    Attendance
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredStudents.map((student, index) => {
                                                const status = getAttendanceStatus(student.studentId);
                                                return (
                                                    <tr
                                                        key={`${student.studentId}-${student.rollNumber}`}
                                                        className="hover:bg-gray-50 transition-colors"
                                                    >
                                                        <td className="py-3 px-4 text-sm font-medium text-gray-900 border border-gray-200">
                                                            {index + 1}
                                                        </td>
                                                        <td className="py-3 px-4 text-sm font-medium text-gray-900 border border-gray-200">
                                                            {student.rollNumber}
                                                        </td>
                                                        <td className="py-3 px-4 text-sm font-medium text-gray-900 border border-gray-200">
                                                            {student.studentName}
                                                        </td>
                                                        <td className="py-3 px-4 border border-gray-200">
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={() => handleAttendanceChange(student.studentId, 'present')}
                                                                    className={`flex items-center justify-center px-3 py-1 rounded-md border text-sm font-medium transition-all duration-200 ${status === 'present' ? 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200' : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'} cursor-pointer`}
                                                                    aria-label="Mark as present"
                                                                >
                                                                    <Check size={16} className="mr-1" />
                                                                    Present
                                                                </button>
                                                                <button
                                                                    onClick={() => handleAttendanceChange(student.studentId, 'absent')}
                                                                    className={`flex items-center justify-center px-3 py-1 rounded-md border text-sm font-medium transition-all duration-200 ${status === 'absent' ? 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200' : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'} cursor-pointer`}
                                                                    aria-label="Mark as absent"
                                                                >
                                                                    <X size={16} className="mr-1" />
                                                                    Absent
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="p-6 text-center text-gray-500">
                                        {selectedSemesterNumber
                                            ? (searchQuery ? 'No students match your search criteria.' : 'No students found for the selected semester.')
                                            : 'Please select a semester to view students.'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md inline-flex items-center">
                            <Check className="text-green-600 mr-2" size={20} />
                            <span className="text-green-800">Attendance successfully recorded and exported!</span>
                        </div>
                        <p className="text-gray-600 mb-6">Would you like to mark attendance for another class?</p>
                        <button
                            onClick={resetForm}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Mark New Attendance
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttendanceManagement;