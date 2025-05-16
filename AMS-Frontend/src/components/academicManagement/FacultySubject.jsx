import axios from "axios";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import CloseButton from '../ui/CloseButton';

export default function FacultySubject() {
  const [semesters, setSemesters] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:8080";
  const { facultyId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const facultyName = queryParams.get('name');
  const collegeId = sessionStorage.getItem("hodCollegeId");
  const departmentName = sessionStorage.getItem("hodDepartment");
  const courseName = sessionStorage.getItem("hodCourse");
  const token = sessionStorage.getItem("hodToken");

  const handleClose = () => {
    navigate(-1);
  };

  useEffect(() => {
    fetchSemestersAndSubjects();
  }, []);

  useEffect(() => {
    if (selectedSemester) {
      const semesterData = allSubjects.find(item => item.semester === selectedSemester);
      if (semesterData) {
        setAvailableSubjects(semesterData.subjects);
        setSelectedSubject(""); // Reset subject when semester changes
      } else {
        setAvailableSubjects([]);
        setSelectedSubject("");
      }
    }
  }, [selectedSemester, allSubjects]);

  const fetchSemestersAndSubjects = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/getSubjectsSemesterwise/${collegeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          courseName: courseName,
          departmentName: departmentName,
        }
      });

      if (response.status === 200) {
        setAllSubjects(response.data);
        // Extract unique semesters
        const uniqueSemesters = [...new Set(response.data.map(item => item.semester))];
        setSemesters(uniqueSemesters);
      } else if (response.status === 204) {
        setSemesters([]);
        toast.error("No subjects found for this department and course");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
      setSemesters([]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedSemester || !selectedSubject) {
      toast.error("Please select both semester and subject");
      return;
    }

    const saveToast = toast.loading("Assigning subject to faculty...");
    try {
      const dto = {
        facultyId: facultyId,
        semester: selectedSemester,
        subject: selectedSubject
      }
      const response = await axios.post(
        `${BASE_URL}/SubjectAssign`,
        dto,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        toast.success("Faculty subject assigned successfully!", {
          id: saveToast,
        });
        setSelectedSemester("");
        setSelectedSubject("");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error saving data. Please try again.", { id: saveToast });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="flex justify-end">
            <CloseButton onClick={handleClose} />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Faculty and Subject Management
          </h1>

          {/* Faculty information */}
          <div className="space-y-3 mb-6">
            <div>
              <span className="font-medium">Faculty Name:</span> {facultyName || "N/A"}
            </div>
            <div>
              <span className="font-medium">Course:</span> {courseName || "N/A"}
            </div>
            <div>
              <span className="font-medium">Department:</span> {departmentName || "N/A"}
            </div>
          </div>

          {/* Semester dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Semester
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              <option value="">Select Semester</option>
              {semesters.map((semester) => (
                <option key={semester} value={semester}>
                  {semester}
                </option>
              ))}
            </select>
          </div>

          {/* Subject dropdown */}
          {selectedSemester && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                disabled={!selectedSemester}
              >
                <option value="">Select Subject</option>
                {availableSubjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Display selected semester and subject */}
          {selectedSemester && selectedSubject && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Faculty:</span> {facultyName || "N/A"}
                </div>
                <div>
                  <span className="font-medium">Semester:</span> {selectedSemester}
                </div>
                <div>
                  <span className="font-medium">Selected Subject:</span> {selectedSubject}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <button
              onClick={handleSubmit}
              disabled={!selectedSemester || !selectedSubject}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            >
              Assign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}