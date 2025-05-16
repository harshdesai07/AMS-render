import { Menu, X} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import download from "../../assets/download.png";
import LoginDropdown from "../ui/LoginDropdown";
import { HiUserAdd } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full fixed top-0 left-0 right-0 z-50 px-6 py-3 flex justify-between items-center 
      bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
      
      {/* Logo & Brand Name */}
      <div className="flex items-center gap-4 group">
        <motion.img
          src={download}
          alt="Logo"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-md"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
        <h2 className="text-lg sm:text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 
          bg-clip-text text-transparent tracking-wide whitespace-nowrap">
          Attendance System
        </h2>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-6 items-center">
        <Link to="/register">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 text-gray-800 text-sm font-medium rounded-full bg-gradient-to-r from-blue-300 to-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <HiUserAdd className="w-5 h-5" />
            Sign Up
          </motion.button>
        </Link>
        <LoginDropdown />
      </div>

      {/* Mobile Menu Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="md:hidden text-gray-700 transition-colors hover:text-blue-600 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </motion.button>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-20 left-4 right-4 bg-white/90 backdrop-blur-lg shadow-lg p-6 
              flex flex-col gap-5 rounded-2xl md:hidden border border-gray-100"
          >
            {/* Sign Up Button */}
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white text-sm 
                  font-medium rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-md 
                  hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer"
              >
                <HiUserAdd className="w-5 h-5" />
                Sign Up
              </motion.button>
            </Link>

            {/* Login Button (Inside Dropdown) */}
            <LoginDropdown />
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}