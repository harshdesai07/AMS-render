import { motion } from "framer-motion";
import { ClipboardCheck, PieChart, Download, UserPlus } from "lucide-react";

function StepCard({ icon, title, desc }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="relative p-8 bg-white rounded-2xl shadow-lg border border-gray-100 
        group hover:shadow-xl transition-all duration-300"
    >
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-sky-500 to-indigo-500 p-3 rounded-xl text-white shadow-lg">
        {icon}
      </div>

      <motion.h3 
        className="text-xl font-bold text-gray-800 mt-4"
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
      >
        {title}
      </motion.h3>
      <p className="text-md mt-2 text-gray-600">{desc}</p>
    </motion.div>
  );
}

export default function Features() {
  const steps = [
    { 
      icon: <UserPlus className="w-6 h-6" />, 
      title: "Sign Up & Log In", 
      desc: "Create your account & access your dashboard." 
    },
    { 
      icon: <ClipboardCheck className="w-6 h-6" />, 
      title: "Mark Attendance", 
      desc: "Easily mark attendance with a single click." 
    },
    { 
      icon: <PieChart className="w-6 h-6" />, 
      title: "View Reports", 
      desc: "Check attendance summaries & trends in real-time." 
    },
    { 
      icon: <Download className="w-6 h-6" />, 
      title: "Export & Analyze", 
      desc: "Download & analyze attendance data effortlessly." 
    }
  ];

  return (
    <section className="relative text-center py-20 px-6 overflow-hidden">

      {/* Section Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-5xl font-extrabold tracking-wide bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm"
        >
          Key Features
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto"
        >
          Everything you need to manage attendance efficiently and effectively
        </motion.p>

        {/* Steps Grid */}
        <div className="relative z-10 mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <StepCard {...step} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}