import axios from "axios";
import { ChevronDown, PlusCircle, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import CloseButton from '../ui/CloseButton';
import {useNavigate} from "react-router-dom";

 export default function CourseDepartment() {
  const [courseSelections, setCourseSelections] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newDepartmentInput, setNewDepartmentInput] = useState("");
  const dropdownRefs = useRef([]);
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:8080";
  const collegeId = sessionStorage.getItem("collegeId");
  const token = sessionStorage.getItem("collegeToken");

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
    fetchCourses();
  }, []);

  const handleClose = () => {
    navigate(-1);  // this takes you back to the previous page
  };

  const handleDropdownClick = async (index) => {
    if (dropdownOpen === index) {
      setDropdownOpen(null);
      return;
    }

    setDropdownOpen(index);
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/getCourses`);
      if (!response.status === 200) {
        throw new Error("Failed to fetch courses");
      }
      const data = await response.data;
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load courses");
    }
  };

  const fetchDepartments = async (courseId, index) => {
    const loadingToast = toast.loading("Loading departments...");
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/departments/${courseId}`);
  
      if (response.status === 404) {
        setCourseSelections((prevSelections) => {
          const newSelections = [...prevSelections];
          newSelections[index].departments = [
            { id: "none", name: "none" },
          ];
          return newSelections;
        });
        toast.dismiss(loadingToast);
        return;
      }
  
      if (response.status !== 200) {
        throw new Error("Error fetching departments");
      }
  
      const data = await response.data;
  
      setCourseSelections((prevSelections) => {
        const newSelections = [...prevSelections];
        newSelections[index].departments =
          data.length > 0 ? data : [{ id: "none", name: "none" }];
        return newSelections;
      });
  
      toast.success("Departments loaded successfully", { id: loadingToast });
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to load departments", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };
  

  const handleAddCourseSelection = () => {
    setCourseSelections([
      ...courseSelections,
      {
        course: null,
        departments: [],
        manualDepartments: [],
      },
    ]);
    toast.success("New course selection added");
  };

  const handleRemoveCourseSelection = (index) => {
    setCourseSelections(courseSelections.filter((_, i) => i !== index));
    toast.success("Course selection removed");
  };

  const handleCourseChange = async (index, selectedCourse) => {
    const newSelections = [...courseSelections];
    newSelections[index] = {
      ...newSelections[index],
      course: selectedCourse,
      departments: [],
      manualDepartments: [],
    };
    setCourseSelections(newSelections);
    setDropdownOpen(null);
    setSearchTerm("");

    if (selectedCourse) {
      await fetchDepartments(selectedCourse.id, index);
    }
  };

  const handleDepartmentChange = (courseIndex, department) => {
    const newSelections = [...courseSelections];
    const currentDepartments = newSelections[courseIndex].departments;

    if (currentDepartments.find((d) => d.id === department.id)) {
      newSelections[courseIndex].departments = currentDepartments.filter(
        (d) => d.id !== department.id
      );
    } else {
      newSelections[courseIndex].departments = [
        ...currentDepartments,
        department,
      ];
    }

    setCourseSelections(newSelections);
  };

  const handleManualDepartmentAdd = (courseIndex) => {
    if (!newDepartmentInput.trim()) return;

    const newSelections = [...courseSelections];
    const manualDepartments =
      newSelections[courseIndex].manualDepartments || [];

    if (!manualDepartments.includes(newDepartmentInput.trim())) {
      newSelections[courseIndex].manualDepartments = [
        ...manualDepartments,
        newDepartmentInput.trim(),
      ];
      setCourseSelections(newSelections);
      setNewDepartmentInput("");
      toast.success("Department added successfully");
    } else {
      toast.error("Department already exists");
    }
  };

  const handleRemoveManualDepartment = (courseIndex, departmentName) => {
    const newSelections = [...courseSelections];
    newSelections[courseIndex].manualDepartments = newSelections[
      courseIndex
    ].manualDepartments.filter((d) => d !== departmentName);
    setCourseSelections(newSelections);
    toast.success("Department removed");
  };

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async () => {
    const hasEmptyDepartments = courseSelections.some(
      (selection) =>
        selection.departments.length === 0 &&
        selection.manualDepartments.length === 0
    );
    
    if (hasEmptyDepartments) {
      toast.error("Every course must have at least one department selected or added.");
      return;
    }
    

    const hasAllCourses = courseSelections.every(
      (selection) => selection.course
    );
    if (!hasAllCourses) {
      toast.error("Please select a course for all entries.");
      return;
    }

    const formattedData = courseSelections.map((selection) => {
      const selectedDeptNames = selection.departments.map((dept) => dept.name);
      const manualDeptNames = selection.manualDepartments;
    
      let combinedDepartments = [];
    
      if (selectedDeptNames.length > 0 && manualDeptNames.length > 0) {
        combinedDepartments = [...selectedDeptNames, ...manualDeptNames];
      } else if (selectedDeptNames.length > 0) {
        combinedDepartments = selectedDeptNames;
      } else if (manualDeptNames.length > 0) {
        combinedDepartments = manualDeptNames;
      }
    
      return {
        collegeId: collegeId,
        courseName: selection.course.name,
        departments: combinedDepartments,
      };
    });
    

    const saveToast = toast.loading("Saving courses and departments...");
    try {
      console.log(formattedData);
      const response = await axios.post(
        `${BASE_URL}/addCourseDept`, 
        formattedData,  // Send formattedData as the request body
        {
          headers: {  // Set headers as a separate config object
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        toast.success("Courses and departments saved successfully!", {
          id: saveToast,
        });
        setCourseSelections([]);
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
            Course and Department Management
          </h1>

          {courseSelections.map((selection, index) => (
            <div
              key={index}
              className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">
                  Course Selection {index + 1}
                </h2>
                <button
                  onClick={() => handleRemoveCourseSelection(index)}
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
                        Course
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
                          {selection.course?.name || "Choose a course"}
                        </span>
                        <ChevronDown
                          className={`h-5 w-5 text-gray-400 transition-transform ${
                            dropdownOpen === index ? "transform rotate-180" : ""
                          }`}
                        />
                      </button>

                      {dropdownOpen === index && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                          <div className="p-2">
                            <input
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              placeholder="Search courses..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                          {loading ? (
                            <div className="p-2 text-gray-500 text-center">
                              Loading courses...
                            </div>
                          ) : (
                            <div className="max-h-60 overflow-auto">
                              {filteredCourses.map((course) => (
                                <button
                                  key={course.id}
                                  className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                                  onClick={() =>
                                    handleCourseChange(index, course)
                                  }
                                >
                                  {course.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {selection.course && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Departments
                      </label>
                    </div>

                    {selection.departments.length === 0 ? (
                      <div className="text-red-600 mb-4">
                        No departments found. Add manually.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {selection.departments.map((department) => (
                          <div
                            key={department.id}
                            className="flex items-center justify-between p-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                          >
                            <span className="text-sm text-gray-700">
                              {department.name}
                            </span>
                            <button
                              onClick={() =>
                                handleDepartmentChange(index, department)
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
                          placeholder="Enter department name"
                          value={newDepartmentInput}
                          onChange={(e) =>
                            setNewDepartmentInput(e.target.value)
                          }
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleManualDepartmentAdd(index);
                            }
                          }}
                        />
                        <button
                          onClick={() => handleManualDepartmentAdd(index)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selection.manualDepartments?.map((dept, deptIndex) => (
                          <div
                            key={deptIndex}
                            className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded"
                          >
                            <span>{dept}</span>
                            <button
                              onClick={() =>
                                handleRemoveManualDepartment(index, dept)
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
              onClick={handleAddCourseSelection}
              className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Add Another Course
            </button>

            <button
              onClick={handleSubmit}
              disabled={courseSelections.length === 0}
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
