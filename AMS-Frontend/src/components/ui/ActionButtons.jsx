import { FaEdit, FaTrash, FaBook, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ActionButtons = ({ 
  onUpdate, 
  onDelete, 
  onAssignSubject, 
  onSendFeeEmail,
  disableAssignSubject, 
  assignSubjectTooltip,
  isStudent 
}) => {
  return (
    <div className="flex space-x-1 sm:space-x-2 p-1">
      {/* Update button with tooltip */}
      <motion.button
        onClick={onUpdate}
        whileHover={{ scale: 1.05, boxShadow: "0px 0px 6px rgba(59, 130, 246, 0.5)" }}
        whileTap={{ scale: 0.95 }}
        className="p-3.5 text-blue-600 rounded-full shadow-md transition-all duration-300 hover:brightness-110 hover:shadow-blue-500/50 cursor-pointer"
        title="Update"
      >
        <FaEdit className="text-xs sm:text-sm" />
      </motion.button>
    
      {/* Delete button with tooltip */}
      <motion.button
        onClick={onDelete}
        whileHover={{ scale: 1.05, boxShadow: "0px 0px 6px rgba(239, 68, 68, 0.5)" }}
        whileTap={{ scale: 0.95 }}
        className="p-3.5 text-red-600 rounded-full shadow-md transition-all duration-300 hover:brightness-110 hover:shadow-red-500/50 cursor-pointer"
        title="Delete"
      >
        <FaTrash className="text-xs sm:text-sm" />
      </motion.button>

      {/* Assign subject button with tooltip */}
      {onAssignSubject && (
        <motion.button
          onClick={onAssignSubject}
          disabled={disableAssignSubject}
          whileHover={!disableAssignSubject ? { 
            scale: 1.05, 
            boxShadow: "0px 0px 6px rgba(101, 163, 13, 0.5)" 
          } : {}}
          whileTap={!disableAssignSubject ? { scale: 0.95 } : {}}
          className={`p-3.5 rounded-full shadow-md transition-all duration-300 ${
            disableAssignSubject
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-green-600 hover:brightness-110 hover:shadow-green-500/50 cursor-pointer'
          }`}
          title={disableAssignSubject ? assignSubjectTooltip || "Add subjects first" : "Assign Subject"}
        >
          <FaBook className="text-xs sm:text-sm" />
        </motion.button>
      )}

      {/* Send fee email button (only for students) */}
      {isStudent && onSendFeeEmail && (
        <motion.button
          onClick={onSendFeeEmail}
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 6px rgba(168, 85, 247, 0.5)" }}
          whileTap={{ scale: 0.95 }}
          className="p-3.5 text-purple-600 rounded-full shadow-md transition-all duration-300 hover:brightness-110 hover:shadow-purple-500/50 cursor-pointer"
          title="Send Fee Email"
        >
          <FaEnvelope className="text-xs sm:text-sm" />
        </motion.button>
      )}
    </div>
  );
};

export default ActionButtons;