import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, LogIn, User, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { label: "College Login", icon: GraduationCap, path: "/CollegeLogin" },
  { label: "Faculty Login", icon: Users, path: "/FacultyLogin" },
  { label: "Student Login", icon: User, path: "/StudentLogin" },
];

const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut",
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: -20,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.3
    }
  }
};

export default function LoginDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-gray-800 text-sm font-medium rounded-full bg-gradient-to-r from-blue-300 to-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
        aria-expanded={isOpen}
      >
        <LogIn className="w-5 h-5" />
        Login
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 mt-4 w-80 bg-white/95 backdrop-blur-2xl
                     rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]
                     border border-gray-100/50 overflow-hidden z-50 "
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none rounded-3xl "
              animate={{
                background: hoveredIndex !== null 
                  ? "linear-gradient(to bottom, rgba(219, 234, 254, 0.5), transparent)"
                  : "linear-gradient(to bottom, rgba(239, 246, 255, 0.5), transparent)",
                transition: { duration: 0.3 }
              }}
            />
            <motion.ul 
              className="py-3 relative"
              variants={dropdownVariants}
            >
              {menuItems.map(({ label, icon: Icon, path }, index) => (
                <motion.li
                  key={path}
                  variants={itemVariants}
                  className="px-3 "
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <motion.button
                    whileHover={{ 
                      scale: 1.02,
                      backgroundColor: "rgba(59, 130, 246, 0.08)",
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsOpen(false);
                      navigate(path);
                    }}
                    className="group w-full px-4 py-3.5 rounded-2xl
                             flex items-center gap-4
                             transition-all duration-300 ease-out
                             hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] cursor-pointer"
                  >
                    <motion.span 
                      className="p-2.5 rounded-xl bg-gray-50/80 group-hover:bg-blue-50/80 
                               ring-1 ring-gray-100/50 group-hover:ring-blue-100/50
                               transition-colors shadow-sm"
                      animate={{
                        rotate: hoveredIndex === index ? [0, -10, 10, -5, 5, 0] : 0,
                        transition: {
                          duration: 0.5,
                          ease: "easeInOut",
                          times: [0, 0.2, 0.4, 0.6, 0.8, 1]
                        }
                      }}
                    >
                      <Icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" 
                           strokeWidth={2} />
                    </motion.span>
                    <motion.span 
                      className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors"
                      animate={{
                        x: hoveredIndex === index ? [0, 2, -2, 1, -1, 0] : 0,
                        transition: {
                          duration: 0.5,
                          ease: "easeInOut",
                          times: [0, 0.2, 0.4, 0.6, 0.8, 1]
                        }
                      }}
                    >
                      {label}
                    </motion.span>
                  </motion.button>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}