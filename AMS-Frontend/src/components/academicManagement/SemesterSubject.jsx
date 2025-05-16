import axios from "axios";
import { ChevronDown, PlusCircle, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CloseButton from '../ui/CloseButton';


export default function SemesterSubject() {
  const [semesterSelections, setSemesterSelections] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newSubjectInput, setNewSubjectInput] = useState("");
  const dropdownRefs = useRef([]);
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:8080";
  const collegeId = sessionStorage.getItem("collegeId");
  const token = sessionStorage.getItem("hodToken");

  const handleClose = () => {
    navigate(-1);  // this will send you back to the previous page
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownOpen !== null &&
        !dropdownRefs.current[dropdownOpen]?.contains(event.target)
      ) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  useEffect(() => {
    fetchSemesters();
  }, []);

  const handleDropdownClick = async (index) => {
    if (dropdownOpen === index) {
      setDropdownOpen(null);
      return;
    }

    setDropdownOpen(index);
  };

  const fetchSemesters = async () => {
    try {
      const courseName = sessionStorage.getItem("hodCourse");
      const response = await axios.get(`${BASE_URL}/getSemester/${courseName}`,);

      if (!response.status === 200) {
        throw new Error("Failed to fetch semesters");
      }
      const data = await response.data;
      setSemesters(data);
    } catch (error) {
      console.error("Error fetching semesters:", error);
      toast.error("Failed to load semesters");
    }
  };

  const fetchSubjects = async (semesterNumber, index) => {
    const loadingToast = toast.loading("Loading subjects...");
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/getSubjects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          departmentName: sessionStorage.getItem("hodDepartment"),
          semesterNumber: semesterNumber,
        }
      });

      if (response.status === 404) {
        setSemesterSelections((prevSelections) => {
          const newSelections = [...prevSelections];
          newSelections[index].subjects = [];
          return newSelections;
        });
        toast.dismiss(loadingToast);
        return;
      }

      if (response.status !== 200) {
        throw new Error("Error fetching subjects");
      }

      const data = await response.data;

      setSemesterSelections((prevSelections) => {
        const newSelections = [...prevSelections];
        newSelections[index].subjects = data || [];
        return newSelections;
      });

      toast.success("Subjects loaded successfully", { id: loadingToast });
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast.error("Failed to load subjects", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSemesterSelection = () => {
    setSemesterSelections([
      ...semesterSelections,
      {
        semester: null,
        subjects: [],
        manualSubjects: [],
      },
    ]);
    toast.success("New semester selection added");
  };

  const handleRemoveSemesterSelection = (index) => {
    setSemesterSelections(semesterSelections.filter((_, i) => i !== index));
    toast.success("Semester selection removed");
  };

  const handleSemesterChange = async (index, selectedSemester) => {
    const newSelections = [...semesterSelections];
    newSelections[index] = {
      ...newSelections[index],
      semester: selectedSemester,
      subjects: [],
      manualSubjects: [],
    };
    setSemesterSelections(newSelections);
    setDropdownOpen(null);
    setSearchTerm("");

    if (selectedSemester) {
      await fetchSubjects(selectedSemester.semesterNumber, index);
    }
  };

  const handleSubjectChange = (semesterIndex, subject) => {
    const newSelections = [...semesterSelections];
    const currentSubjects = newSelections[semesterIndex].subjects;

    if (currentSubjects.find((s) => s.id === subject.id)) {
      newSelections[semesterIndex].subjects = currentSubjects.filter(
        (s) => s.id !== subject.id
      );
    } else {
      newSelections[semesterIndex].subjects = [
        ...currentSubjects,
        subject,
      ];
    }

    setSemesterSelections(newSelections);
  };

  const handleManualSubjectAdd = (semesterIndex) => {
    if (!newSubjectInput.trim()) return;

    const newSelections = [...semesterSelections];
    const manualSubjects = newSelections[semesterIndex].manualSubjects || [];

    if (!manualSubjects.includes(newSubjectInput.trim())) {
      newSelections[semesterIndex].manualSubjects = [
        ...manualSubjects,
        newSubjectInput.trim(),
      ];
      setSemesterSelections(newSelections);
      setNewSubjectInput("");
      toast.success("Subject added successfully");
    } else {
      toast.error("Subject already exists");
    }
  };

  const handleRemoveManualSubject = (semesterIndex, subjectName) => {
    const newSelections = [...semesterSelections];
    newSelections[semesterIndex].manualSubjects = newSelections[
      semesterIndex
    ].manualSubjects.filter((s) => s !== subjectName);
    setSemesterSelections(newSelections);
    toast.success("Subject removed");
  };

  const filteredSemesters = semesters.filter(
    (semester) => semester?.semesterNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleSubmit = async () => {
    const hasEmptySubjects = semesterSelections.some(
      (selection) =>
        selection.subjects.length === 0 &&
        selection.manualSubjects.length === 0
    );

    if (hasEmptySubjects) {
      toast.error("Every semester must have at least one subject selected or added.");
      return;
    }

    const hasAllSemesters = semesterSelections.every(
      (selection) => selection.semester
    );
    if (!hasAllSemesters) {
      toast.error("Please select a semester for all entries.");
      return;
    }

    const formattedData = semesterSelections.map((selection) => {
      const selectedSubjectNames = selection.subjects.map((subj) => subj.name);
      const manualSubjectNames = selection.manualSubjects;

      let combinedSubjects = [];

      if (selectedSubjectNames.length > 0 && manualSubjectNames.length > 0) {
        combinedSubjects = [...selectedSubjectNames, ...manualSubjectNames];
      } else if (selectedSubjectNames.length > 0) {
        combinedSubjects = selectedSubjectNames;
      } else if (manualSubjectNames.length > 0) {
        combinedSubjects = manualSubjectNames;
      }

      return {
        semester: selection.semester.semesterNumber,
        subjects: combinedSubjects,
      };
    });

    const saveToast = toast.loading("Saving semesters and subjects...");
    try {
      console.log(formattedData);
      const response = await axios.post(
        `${BASE_URL}/addSubjects`,
        formattedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        toast.success("Semesters and subjects saved successfully!", {
          id: saveToast,
        });
        setSemesterSelections([]);
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
            Semester and Subject Management
          </h1>

          {semesterSelections.map((selection, index) => (
            <div
              key={index}
              className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">
                  Semester Selection {index + 1}
                </h2>
                <button
                  onClick={() => handleRemoveSemesterSelection(index)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Semester
                      </label>
                    </div>

                    <div
                      className="relative"
                      ref={(el) => (dropdownRefs.current[index] = el)}
                    >
                      <button
                        onClick={() => handleDropdownClick(index)}
                        className="flex justify-between items-center w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 shadow-sm hover:border-blue-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      >
                        <span>
                          {selection.semester?.semesterNumber || "Choose a semester"}
                        </span>
                        <ChevronDown
                          className={`h-5 w-5 text-gray-400 transition-transform ${dropdownOpen === index ? "transform rotate-180" : ""
                            }`}
                        />
                      </button>

                      {dropdownOpen === index && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                          <div className="p-2">
                            <input
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              placeholder="Search semesters..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                          {loading ? (
                            <div className="p-2 text-gray-500 text-center">
                              Loading semesters...
                            </div>
                          ) : (
                            <div className="max-h-60 overflow-auto">
                              {filteredSemesters.map((semester) => (
                                <button
                                  key={semester.id}
                                  className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                                  onClick={() =>
                                    handleSemesterChange(index, semester)
                                  }
                                >
                                  {semester.semesterNumber}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {selection.semester && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Subjects
                      </label>
                    </div>

                    {selection.subjects.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {selection.subjects.map((subject) => (
                          <div
                            key={subject.id}
                            className="flex items-center justify-between p-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                          >
                            <span className="text-sm text-gray-700">
                              {subject.name}
                            </span>
                            <button
                              onClick={() =>
                                handleSubjectChange(index, subject)
                              }
                              className="text-red-500 hover:text-red-600"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="flex-1 rounded-md border-gray-300"
                          placeholder="Enter subject name"
                          value={newSubjectInput}
                          onChange={(e) =>
                            setNewSubjectInput(e.target.value)
                          }
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleManualSubjectAdd(index);
                            }
                          }}
                        />
                        <button
                          onClick={() => handleManualSubjectAdd(index)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selection.manualSubjects?.map((subj, subjIndex) => (
                          <div
                            key={subjIndex}
                            className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded"
                          >
                            <span>{subj}</span>
                            <button
                              onClick={() =>
                                handleRemoveManualSubject(index, subj)
                              }
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="flex justify-between mt-6">
            <button
              onClick={handleAddSemesterSelection}
              className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Add Another Semester
            </button>

            <button
              onClick={handleSubmit}
              disabled={semesterSelections.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            >
              Save All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}