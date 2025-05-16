import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Trash2,
  GraduationCap,
  ClipboardList,
  AlertCircle,
  Clock,
  CheckCircle2
} from 'lucide-react';
import axios from 'axios';
import CloseButton from '../ui/CloseButton';
import { useNavigate, useLocation } from 'react-router-dom';
import {Toaster , toast } from "react-hot-toast";

export default function FacultyTaskScheduler() {
  const [facultyList, setFacultyList] = useState([]);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', assignTo: '', dueDate: '' });
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState(null);
  const BaseURL = 'http://localhost:8080';
  
  const location = useLocation();
  const userRole = location.state?.userRole;
  const isHOD = userRole === 'HOD';
  const collegeId = isHOD ? sessionStorage.getItem('hodCollegeId') : sessionStorage.getItem('facultyCollegeId');
  const token = isHOD ? sessionStorage.getItem('hodToken') : sessionStorage.getItem('facultyToken');
  const userId = isHOD ? sessionStorage.getItem('hodId') : sessionStorage.getItem('facultyId');
  const navigate = useNavigate();
  const options = isHOD ? ['all', 'pending', 'completed', 'overdue'] : ['all', 'pending'];

  const handleClose = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (isHOD) {
      const fetchFaculty = async () => {
        try {
          const response = await axios.get(`${BaseURL}/getfaculty/${collegeId}/HOD`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              courseName: sessionStorage.getItem("hodCourse"),
              departmentName: sessionStorage.getItem("hodDepartment"),
            },
          });
          
          if (response.status !== 200) {
            toast.error('Failed to fetch faculty list');
            return;
          }
          setFacultyList(response.data || []);
        } catch (err) {
          setError(err.message);
          console.error('Error fetching faculty:', err);
          toast.error('Failed to fetch faculty list');
        }
      };

      fetchFaculty();
    }
  }, [collegeId, token, isHOD]);

  useEffect(() => {
    if (!userId) return;

    const checkAndUpdateOverdue = async () => {
      try {
        const currentTasks = await fetchTasksForOverdueCheck();
        const now = new Date();
        
        const overdueTasks = currentTasks.filter(
          task => task.status === 'pending' && new Date(task.dueDate) < now
        );

        if (overdueTasks.length === 0) return;

        for (const task of overdueTasks) {
          try {
            await axios({
              method: 'put',
              url: `${BaseURL}/updateTaskStatus`,
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              params: {
                scheduleId: task.scheduleId,
                status: 'overdue'
              }
            });
          } catch (err) {
            console.error(`Failed to update task ${task.scheduleId}:`, err);
          }
        }

        await fetchTasks();
      } catch (err) {
        console.error('Error in overdue task check:', err);
      }
    };

    const fetchTasksForOverdueCheck = async () => {
      try {
        let response;
        if (isHOD) {
          response = await axios.get(`${BaseURL}/getAssignBy/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          response = await axios.get(`${BaseURL}/getAssignTo/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
        return response.data || [];
      } catch (err) {
        console.error('Error fetching tasks for overdue check:', err);
        return [];
      }
    };

    checkAndUpdateOverdue();
    const interval = setInterval(checkAndUpdateOverdue, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [userId]);

  const fetchTasks = async () => {
    if (!userId) return;
    
    try {
      let response;
      if (isHOD) {
        response = await axios.get(`${BaseURL}/getAssignBy/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        response = await axios.get(`${BaseURL}/getAssignTo/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      if (response.status !== 200) {
        toast.error('Failed to fetch tasks');
        return;
      }

      const tasksData = response.data || [];
      const processedTasks = tasksData.map(task => ({
        ...task,
        taskId: task.id || task.taskId,
      }));

      setTasks(processedTasks);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching tasks:', err);
      toast.error('Failed to fetch tasks');
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId, isHOD]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isHOD) return;
    
    if (!taskForm.title || !taskForm.assignTo || !taskForm.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const selectedFaculty = facultyList.find(faculty => faculty.facultyName === taskForm.assignTo);
    if (!selectedFaculty) {
      toast.error('Please select a valid faculty member');
      return;
    }

    try {
      const currentDate = new Date();
      const status = currentDate > new Date(taskForm.dueDate) ? 'overdue' : 'pending';
      const response = await axios.post(
        `${BaseURL}/SechduleTask`,
        {
          title: taskForm.title,
          description: taskForm.description,
          status: status,
          hodId: userId,
          facultyId: selectedFaculty.facultyId,
          dueDate: `${taskForm.dueDate}T00:00:00`,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success('Task assigned successfully to ' + selectedFaculty.facultyName);
        await fetchTasks();
        setTaskForm({ title: '', description: '', assignTo: '', dueDate: '' });
        setIsFormOpen(false);
      } else {
        throw new Error('Failed to save task');
      }
    } catch (err) {
      toast.error('Failed to assign task. Please try again.');
      console.error('Error saving task:', err);
    }
  };

  const deleteTask = async (taskId) => {
    if (!taskId || !isHOD) return;
  
    // Show confirmation toast instead of window.confirm
    const confirmation = await new Promise((resolve) => {
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} 
          bg-white p-4 rounded-lg shadow-lg border border-gray-200`}>
          <p className="font-medium text-gray-800 mb-4">
            Are you sure you want to delete this task?
          </p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(false);
              }}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded cursor-pointer text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(true);
              }}
              className="px-3 py-1 text-sm bg-red-600 text-white hover:bg-red-700 rounded cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      ), {
        duration: Infinity, // Don't auto-dismiss
      });
    });
  
    if (!confirmation) return;
  
    try {
      const response = await axios.delete(`${BaseURL}/deleteTask/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (response.status === 200) {
        await fetchTasks();
        toast.success('Task deleted successfully');
      } else {
        throw new Error('Failed to delete task');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error deleting task:', err);
      toast.error('Failed to delete task');
    }
  };

  const markTaskComplete = async (taskId) => {
    if (!taskId || isHOD) return;
    
    try {
      const response = await axios({
        method: 'put',
        url: `${BaseURL}/updateTaskStatus`,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: {
          scheduleId: taskId,
          status: 'completed'
        }
      });

      if (response.status === 200) {
        await fetchTasks();
        toast.success('Task marked as completed successfully');
      } else {
        throw new Error('Failed to update task status');
      }
    } catch (err) {
      toast.error('Failed to mark task as complete');
      console.error('Error updating task:', err);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (!isHOD && task.status === 'completed') return false;
    return filter === 'all' || task.status === filter;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isPastDue = (dueDate, status) => {
    return status !== 'completed' && new Date(dueDate) < new Date();
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const pending = tasks.filter(task => task.status === 'pending').length;
    const overdue = tasks.filter(task => 
      task.status === 'overdue' || (task.status === 'pending' && isPastDue(task.dueDate, task.status))
    ).length;
  
    return { total, completed, pending, overdue };
  };

  const stats = getTaskStats();

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 flex items-center justify-center">
        <div className="text-center bg-red-100 p-6 rounded-lg max-w-md">
          <AlertCircle size={48} className="text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Data</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
      <Toaster position="top-center" />
        <div className="absolute top-4 right-4 z-10">
          <CloseButton onClick={handleClose} />
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap size={40} className="text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-blue-900 mb-2 tracking-tight">
            {isHOD ? 'Faculty Task Scheduler' : 'My Tasks'}
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            {isHOD ? 'Efficiently manage and assign tasks to faculty members across departments' : 'View and manage your assigned tasks'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          
          {isHOD && (
            <div className="bg-white rounded-xl shadow-sm p-4 flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <ClipboardList size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
          </div>
          )}

          {isHOD && (
            <div className="bg-white rounded-xl shadow-sm p-4 flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle2 size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-800">{stats.completed}</p>
              </div>
            </div>
          )}

          {isHOD && (
            <div className="bg-white rounded-xl shadow-sm p-4 flex items-center space-x-3">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock size={24} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
            </div>
          </div>
          )}

          {isHOD && (
            <div className="bg-white rounded-xl shadow-sm p-4 flex items-center space-x-3">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle size={24} className="text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-800">{stats.overdue}</p>
              </div>
            </div>
          )}
        </div>

        {isHOD && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 transition-all duration-300 transform hover:shadow-lg">
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <span className="bg-blue-100 p-2 rounded-full mr-3 text-blue-700">
                    <PlusCircle size={20} />
                  </span>
                  Assign New Task
                </h2>
                <button
                  onClick={() => setIsFormOpen(!isFormOpen)}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center text-sm font-medium"
                >
                  {isFormOpen ? 'Hide Form' : 'Show Form'}
                </button>
              </div>

              {isFormOpen && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Task Title<span className="text-red-500">*</span></label>
                      <input
                        name="title"
                        value={taskForm.title}
                        onChange={handleInputChange}
                        placeholder="Enter task title"
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Assign To<span className="text-red-500">*</span></label>
                      <select
                        name="assignTo"
                        value={taskForm.assignTo}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                      >
                        <option value="">Select Faculty</option>
                        {facultyList.map(faculty => (
                          <option key={faculty.facultyId} value={faculty.facultyName}>
                            {faculty.facultyName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      name="description"
                      value={taskForm.description}
                      onChange={handleInputChange}
                      placeholder="Enter task description"
                      rows="3"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    ></textarea>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Due Date<span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      name="dueDate"
                      value={taskForm.dueDate}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 font-medium shadow-sm hover:shadow"
                    >
                      <PlusCircle size={18} />
                      <span>Assign Task</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <span className="bg-indigo-100 p-2 rounded-full mr-3 text-indigo-700">
                  <CheckCircle size={20} />
                </span>
                {isHOD ? 'Tasks Overview' : 'My Tasks'}
              </h2>
              <div className="flex items-center bg-slate-100 rounded-lg p-1">
                {options.map((option) => (
                  <button
                    key={option}
                    onClick={() => setFilter(option)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      filter === option
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-transparent text-gray-600 hover:bg-slate-200'
                    }`}
                  >
                    {option === 'all' ? 'All Tasks' : option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-lg">
                <div className="text-slate-400 mb-3 flex justify-center">
                  <XCircle size={48} />
                </div>
                <p className="text-slate-600 font-medium">No tasks found</p>
                <p className="text-slate-500 text-sm mt-1">
                  {filter === 'all'
                    ? isHOD ? 'Start by creating a new task above' : 'No tasks assigned to you yet'
                    : `No ${filter} tasks found`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTasks.map((task) => {
                  const facultyName = isHOD ? task.assignedTo?.facultyName : task.assignedBy?.facultyName;
                  const isCompleted = task.status === 'completed';
                  const overdue = !isCompleted && isPastDue(task.dueDate);

                  return (
                    <div
                      key={task.scheduleId}
                      className={`border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md ${
                        isCompleted
                          ? 'border-green-200 bg-green-50'
                          : overdue
                            ? 'border-red-200 bg-red-50'
                            : 'border-blue-200 bg-blue-50'
                      }`}
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className={`font-semibold ${
                            isCompleted ? 'text-green-800 line-through' : 'text-gray-800'
                          }`}>
                            {task.title}
                          </h3>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium flex items-center ${
                              isCompleted
                                ? 'bg-green-200 text-green-800'
                                : overdue
                                  ? 'bg-red-200 text-red-800'
                                  : 'bg-yellow-200 text-yellow-800'
                            }`}
                          >
                            {isCompleted ? (
                              <><CheckCircle2 size={12} className="mr-1" />Completed</>
                            ) : overdue ? (
                              <><AlertCircle size={12} className="mr-1" />Overdue</>
                            ) : (
                              <><Clock size={12} className="mr-1" />Pending</>
                            )}
                          </span>
                        </div>

                        <p className={`text-sm mb-3 ${
                          isCompleted ? 'text-green-700' : 'text-gray-600'
                        }`}>
                          {task.description || 'No description provided'}
                        </p>

                        <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-4">
                          <div className="flex items-center">
                            <User size={14} className="mr-1" />
                            <span>{isHOD ? `Assigned to: ${facultyName}` : `Assigned by: ${facultyName || 'HOD'}`}</span>
                          </div>
                          <div className={`flex items-center ${
                            overdue ? 'text-red-600 font-medium' : ''
                          }`}>
                            <Calendar size={14} className="mr-1" />
                            <span>{formatDate(task.dueDate)}</span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          {isHOD ? (
                            <button
                              onClick={() => deleteTask(task.scheduleId)}
                              className="flex items-center px-3 py-1.5 rounded text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors duration-200 cursor-pointer"
                            >
                              <Trash2 size={14} className="mr-1" />
                              Delete
                            </button>
                          ) : (!isCompleted && task.status === 'pending') && (
                            <button
                              onClick={() => markTaskComplete(task.scheduleId)}
                              className="flex items-center px-3 py-1.5 rounded text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors duration-200 cursor-pointer"
                            >
                              <CheckCircle2 size={14} className="mr-1" />
                              Mark Complete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}