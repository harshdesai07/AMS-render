import { useState, useEffect } from 'react';
import { FilePlus, Search, Download, FileText, Upload } from 'lucide-react';
import CloseButton from '../ui/CloseButton';
import { useNavigate } from 'react-router-dom';

export default function StudentAssignment() {
  const [successMessage, setSuccessMessage] = useState(null);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeAssignmentId, setActiveAssignmentId] = useState(null);
  const [statusFilter, setStatusFilter] = useState(''); // NEW FIELD

  const navigate = useNavigate();

  const studentId = sessionStorage.getItem('studentId');
  const token = sessionStorage.getItem('studentToken');
  const base_url = 'http://localhost:8080';

  const handleClose = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchStudentAssignments = async () => {
      try {
        setLoadingSubmissions(true);
        const response = await fetch(`${base_url}/getAllAssignments/STUDENT/${studentId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch assignments: ${response.status}`);
        }

        const data = await response.json();

        const formattedAssignments = data.map(assignment => {
          const assignmentTitle = assignment.assignmentName ||
            assignment.assignmentTitle ||
            'Untitled Assignment';

          const submissionDate = assignment.date || 'None';

          // Pass through status as received (for filtering)
          return {
            assignmentId: assignment.assignmentId,
            assignmentTitle,
            submissionDate,
            status: assignment.status || 'PENDING', // default fallback if not present
          };
        });

        setSubmissions(formattedAssignments);
      } catch (error) {
        console.error('Error fetching assignments:', error);
        setSubmissions([]);
      } finally {
        setLoadingSubmissions(false);
      }
    };

    fetchStudentAssignments();
  }, [studentId, token, base_url]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleUploadSuccess = () => {
    setIsUploadModalOpen(false);
    setSuccessMessage('Assignment submitted successfully!');
    setFile(null);
    setFileName('');
    setActiveAssignmentId(null);

    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  const handleSubmit = async (fileToUpload, assignmentId) => {
    if (!fileToUpload || !studentId || !assignmentId) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", fileToUpload);
      const assignmentDto = {
        id: studentId,
        assignmentId: assignmentId,
      };

      formData.append(
        "data",
        new Blob([JSON.stringify(assignmentDto)], {
          type: "application/json",
        })
      );

      const response = await fetch(`${base_url}/uploadAssignment/STUDENT`, {
        method: "POST",
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      await response.json();
      handleUploadSuccess();
    } catch (error) {
      console.error("Error submitting assignment:", error);
      setSuccessMessage('Failed to submit assignment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filtering logic: filter by searchTerm AND status
  const filteredSubmissions = submissions.filter((submission) => {
    const titleMatch = submission.assignmentTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter ? submission.status === statusFilter : true;
    return titleMatch && statusMatch;
  });

  const getFileIcon = () => {
    return <FileText size={20} className="text-blue-600" />;
  };

  const handleDownload = async (assignmentId) => {
    try {
      const response = await fetch(
        `${base_url}/downloadAssignment/${assignmentId}/STUDENT`,
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

      const { downloadUrl: url } = await response.json();
      if (!url) {
        throw new Error('No download URL received');
      }

      window.open(url, '_blank');
    } catch (err) {
      alert('Failed to download file.');
      console.error(err);
    }
  };

  const openUploadModal = (assignmentId) => {
    setActiveAssignmentId(assignmentId);
    setIsUploadModalOpen(true);
    setFile(null);
    setFileName('');
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    handleSubmit(file, activeAssignmentId);
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
            <h2 className="text-2xl font-bold text-white">Assignment Submissions</h2>
            <p className="text-blue-200 mt-1">View and submit your assignments</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Assignments</h3>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full rounded-lg border border-gray-200 pl-10 pr-3 py-2.5 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Search by assignment title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* Status Filter Field */}
            <div className="flex items-center">
              <label htmlFor="status-filter" className="mr-2 text-sm font-medium text-gray-700 whitespace-nowrap">
                Status
              </label>
              <select
                id="status-filter"
                className="rounded-lg border border-gray-200 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="">All</option>
                <option value="PENDING">PENDING</option>
                <option value="SUBMITTED">SUBMITTED</option>
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
                <div key={submission.assignmentId} className="group flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-gray-200 rounded-xl bg-white hover:shadow-md hover:border-blue-200">
                  <div className="flex-1 min-w-0 mb-3 sm:mb-0">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50">
                        {getFileIcon()}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-800">
                          {submission.assignmentTitle}
                        </h4>
                        {/* Show status badge */}
                        <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded ${submission.status === 'SUBMITTED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {submission.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Submission Date: {submission.submissionDate}</p>
                  </div>

                  <div className="flex flex-row gap-2 w-full sm:w-auto mt-3 sm:mt-0">
                    <button
                      type="button"
                      className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2 text-sm font-medium rounded-lg cursor-pointer text-blue-700 bg-blue-50 hover:bg-blue-100"
                      onClick={() => handleDownload(submission.assignmentId)}
                    >
                      <Download size={16} />
                      <span>Download</span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2 text-sm font-medium rounded-lg cursor-pointer text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => openUploadModal(submission.assignmentId)}
                      disabled={submission.status === 'SUBMITTED'}
                    >
                      <FilePlus size={16} />
                      <span>Submit Assignment</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
              <p className="text-gray-500 font-medium">No assignments found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsUploadModalOpen(false)} />
              <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                <form onSubmit={handleModalSubmit}>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Submit Assignment</h3>
                      <button
                        type="button"
                        onClick={() => setIsUploadModalOpen(false)}
                        className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                      >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="assignmentFile" className="block text-sm font-medium text-gray-700 mb-1">
                          Upload Assignment File
                        </label>
                        <div className="flex items-center justify-center w-full">
                          <label
                            htmlFor="assignmentFile"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-gray-300 bg-gray-50 hover:bg-gray-100"
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
                      </div>

                      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 cursor-pointer">
                        <button
                          type="button"
                          onClick={() => setIsUploadModalOpen(false)}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          disabled={loading}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg cursor-pointer text-blue-700 bg-blue-50 hover:bg-blue-100"
                          disabled={loading || !file}
                        >
                          {loading ? (
                            <>
                              <FilePlus size={16} />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <FilePlus size={16} />
                              Submit Assignment
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}