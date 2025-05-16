import { useState, useEffect } from 'react';
import { FilePlus, Search, Filter, Download, FileText, Upload } from 'lucide-react';
import CloseButton from '../ui/CloseButton';
import { useNavigate } from 'react-router-dom';

export default function Assignments() {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [submissionDate, setSubmissionDate] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingSemesters, setFetchingSemesters] = useState(true);
  const [errors, setErrors] = useState({});

  // Submissions states
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const facultyCourse = sessionStorage.getItem('facultyCourse') || 'Computer Science';
  const collegeId = sessionStorage.getItem('facultyCollegeId');
  const facultyId = sessionStorage.getItem('facultyId');
  const token = sessionStorage.getItem('facultyToken');
  const base_url = 'http://localhost:8080'; 

  const handleClose = () => {
    navigate(-1);
  };

  // Fetch StudentSubmissions from backend
  useEffect(() => {
    const fetchStudentSubmissions = async () => {
      try {
        setLoadingSubmissions(true);
        const response = await fetch(`${base_url}/getAllAssignments/FACULTY/${facultyId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch submissions: ${response.status}`);
        }
        
        const data = await response.json();

        console.log('Fetched submissions:', data);
        
        // Handle the List<Map<String, Object>> response
        const formattedSubmissions = data.map(submission => {
          // Extract properties from the Map with proper fallbacks
          const studentName = submission.name || 
                            (submission.student && (submission.student.name || 'Unknown Student')) || 
                            'Unknown Student';
          
          const rollNo = submission.rollNumber || 
                        (submission.student && submission.student.rollNumber) || 
                        'N/A';
          
          const assignmentTitle = submission.assignmentName || 
                                submission.assignmentTitle || 
                                'Untitled Assignment';
          
          const semester = submission.semester || 
                          (submission.semesterDetails && submission.semesterDetails.name) || 
                          'Unknown Semester';
          
          // Handle submitted date - if not submitted, show "Not Submitted Yet"
          const submittedDate = submission.status === 'SUBMITTED' 
                              ? (submission.date || submission.submissionDate || new Date().toISOString())
                              : 'Not Submitted Yet';
          
          const status = submission.status || 'Not Submitted';

          // Determine if the assignment is submitted
          const isSubmitted = submission.status === 'SUBMITTED';
          
          return {
            assignmentId:  submission.assignmentId,
            studentId: submission.studentId,
            studentName,
            rollNo,
            assignmentTitle,
            semester,
            submittedDate,
            status,
            isSubmitted,
          };
        });
        
        setSubmissions(formattedSubmissions);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        setSubmissions([]);
      } finally {
        setLoadingSubmissions(false);
      }
    };

    fetchStudentSubmissions();
  }, [facultyId, token, base_url]);

  // Fetch semesters from backend
  useEffect(() => {
    const fetchSemestersFromBackend = async () => {
      try {
        setFetchingSemesters(true);
        const response = await fetch(`${base_url}/getSemester/${facultyCourse}`);
        if (!response.ok) {
          throw new Error('Failed to fetch semesters');
        }
        
        const data = await response.json();
        setSemesters(data);
      } catch (error) {
        console.error('Error fetching semesters:', error);
      } finally {
        setFetchingSemesters(false);
      }
    };

    fetchSemestersFromBackend();
  }, [facultyCourse]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) newErrors.title = 'Title is required';
    if (!submissionDate) newErrors.submissionDate = 'Submission date is required';
    if (!selectedSemester) newErrors.semester = 'Semester is required';
    if (!file) newErrors.file = 'Assignment file is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUploadSuccess = () => {
    setIsModalOpen(false);
    setSuccessMessage('Assignment uploaded successfully!');
    
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);

    // Reset form
    setTitle('');
    setSubmissionDate('');
    setSelectedSemester('');
    setFile(null);
    setFileName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Constructing the DTO with actual required values
      const dto = {
        title: title,
        submissionDate: submissionDate,
        id: facultyId,
        collegeId: collegeId,
        semester: semesters.find(s => s.id === selectedSemester)?.name || selectedSemester
      };

      // Convert DTO to JSON blob for @RequestPart("data")
      const formData = new FormData();
      formData.append("data", new Blob([JSON.stringify(dto)], { type: "application/json" }));
      formData.append("file", file);

      const source = "FACULTY";

      const response = await fetch(`${base_url}/uploadAssignment/${source}`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      await response.json();
      handleUploadSuccess();
    } catch (error) {
      console.error("Error uploading assignment:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch = 
      submission.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.assignmentTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && submission.semester === filter;
  });

  const getFileIcon = () => {
    return <FileText size={20} className="text-blue-600" />;
  };

  const formatDate = (dateString) => {
    if (dateString === 'Not Submitted Yet') {
      return 'Not Submitted Yet';
    }
    
    try {
      const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'Invalid Date';
    }
  };

 const handleDownload = async (assignmentId, studentId) => {
  console.log('Download submission with ID:', assignmentId);
  console.log('Student ID:', studentId);
  
  try {
    const response = await fetch(
      `${base_url}/downloadAssignment/${assignmentId}/FACULTY?studentId=${studentId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Could not fetch download URL');
    }

    // Get the download URL from backend response
    const { downloadUrl: url } = await response.json();
    if (!url) {
      throw new Error('No download URL received');
    }

    // 👉 Open the file in a new tab (user can manually download it)
    window.open(url, '_blank');
    
  } catch (err) {
    alert('Failed to download file.');
    console.error(err);
  }
};


  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="absolute top-4 right-4 z-10">
          <CloseButton onClick={handleClose} />
        </div>
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{successMessage}</p>
            </div>
            <button 
              className="ml-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg p-1.5 hover:bg-green-100 inline-flex h-8 w-8"
              onClick={() => setSuccessMessage(null)}
            >
              <span className="sr-only">Dismiss</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
          </div>
        )}

        <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gradient-to-r from-blue-900 to-blue-800 p-6 rounded-xl shadow-lg">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-2xl font-bold text-white">Assignment Management</h2>
            <p className="text-blue-200 mt-1">Upload assignments and track student submissions</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-white text-blue-800 rounded-lg font-medium shadow-md hover:shadow-lg cursor-pointer transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FilePlus size={18} className="mr-2" />
            Upload Assignment
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                 
  <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Submissions</h3>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full rounded-lg border border-gray-200 pl-10 pr-3 py-2.5 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Search by student name, roll no or assignment title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="w-full sm:w-64 relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Filter size={18} className="text-gray-400" />
              </div>
              <select
                className="block w-full rounded-lg border border-gray-200 pl-10 pr-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Semesters</option>
                {semesters.map((semester) => (
                  <option key={semester.id} value={semester.semesterNumber}>
                    {semester.semesterNumber}
                  </option>
                ))}
              </select>
            </div>
          </div>
   
          {loadingSubmissions ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-800"></div>
            </div>
          ) : filteredSubmissions.length > 0 ? (
            <div className="space-y-4">
              {filteredSubmissions.map((submission) => (
                <div key={submission.id} className="group flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-gray-200 rounded-xl bg-white hover:shadow-md hover:border-blue-200">
                  <div className="flex-1 min-w-0 mb-3 sm:mb-0">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50">
                        {getFileIcon(submission.fileName)}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-800">
                          {submission.assignmentTitle}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {submission.isSubmitted 
                            ? `Submitted on ${formatDate(submission.submittedDate)}` 
                            : 'Not Submitted Yet'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{submission.studentName}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Roll No: {submission.rollNo} | {submission.semester}
                    </p>
                  </div>
                  
                  <div className="w-full sm:w-auto mt-3 sm:mt-0">
                    <button
                      type="button"
                      disabled={!submission.isSubmitted}
                      className={`flex items-center justify-center sm:justify-start gap-2 px-4 py-2 text-sm font-medium rounded-lg  cursor-pointer ${
                        submission.isSubmitted 
                          ? 'text-blue-700 bg-blue-50 hover:bg-blue-100'
                          : 'text-gray-500 bg-gray-100 cursor-not-allowed'
                      }`}
                      onClick={() => {
                        if (submission.isSubmitted) {
                          handleDownload(submission.assignmentId, submission.studentId);
                        }
                      }}
                    >
                      <Download size={16} />
                      <span>{submission.isSubmitted ? 'Download' : 'Not Available'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
              <p className="text-gray-500 font-medium">No submissions found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsModalOpen(false)} />
              <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Upload Assignment</h3>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Assignment Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={`w-full rounded-lg border ${
                          errors.title ? 'border-red-500' : 'border-gray-300'
                        } px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                        placeholder="Enter assignment title"
                      />
                      {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
                    </div>

                    <div>
                      <label htmlFor="submissionDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Submission Date
                      </label>
                      <input
                        type="date"
                        id="submissionDate"
                        value={submissionDate}
                        onChange={(e) => setSubmissionDate(e.target.value)}
                        className={`w-full rounded-lg border ${
                          errors.submissionDate ? 'border-red-500' : 'border-gray-300'
                        } px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                        min={new Date().toISOString().split('T')[0]}
                      />
                      {errors.submissionDate && <p className="mt-1 text-xs text-red-600">{errors.submissionDate}</p>}
                    </div>

                    <div>
                      <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">
                        Semester
                      </label>
                      <select
                        id="semester"
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                        className={`w-full rounded-lg border ${
                          errors.semester ? 'border-red-500' : 'border-gray-300'
                        } px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                        disabled={fetchingSemesters}
                      >
                        <option value="">Select semester</option>
                        {semesters.map((semester) => (
                          <option key={semester.id} value={semester.semesterNumber}>
                            {semester.semesterNumber}
                          </option>
                        ))}
                      </select>
                      {errors.semester && <p className="mt-1 text-xs text-red-600">{errors.semester}</p>}
                    </div>

                    <div>
                      <label htmlFor="assignmentFile" className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Assignment
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="assignmentFile"
                          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer
                          ${errors.file ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'} 
                          hover:bg-gray-100`}
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6 cursor-pointer">
                            <Upload className="w-8 h-8 mb-3 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PDF, DOC, DOCX (MAX. 10MB)</p>
                          </div>
                          <input
                            id="assignmentFile"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                      {fileName && (
                        <p className="mt-2 text-sm text-gray-600">
                          Selected file: <span className="font-medium">{fileName}</span>
                        </p>
                      )}
                      {errors.file && <p className="mt-1 text-xs text-red-600">{errors.file}</p>}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 cursor-pointer">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-800 rounded-lg hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            Uploading...
                          </div>
                        ) : (
                          'Upload Assignment'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}