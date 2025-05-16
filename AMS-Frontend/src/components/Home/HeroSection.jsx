import { motion } from "framer-motion";
import { Users, Building2 } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative text-center py-20 px-6 overflow-hidden">

      {/* Hero Content */}
      <div className="relative z-10 max-w-6xl mx-auto mt-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl sm:text-6xl font-extrabold tracking-wide bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm"
        >
          Welcome to AMS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto"
        >
          Streamline your attendance management with our modern, intuitive system designed for both educational institutions and businesses.
        </motion.p>

        {/* Stats Section */}
        <div className="relative z-10 mt-16 grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            { label: "Students Tracked", count: 5000, icon: Users },
            { label: "Employees Managed", count: 1000, icon: Building2 },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.15 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="relative p-8 bg-white rounded-2xl shadow-lg border border-gray-100 
                group hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-sky-500 to-indigo-500 p-3 rounded-xl text-white shadow-lg">
                <item.icon className="w-6 h-6" />
              </div>

              <motion.h2 
                className="text-4xl sm:text-5xl font-bold text-gray-800 mt-4"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
              >
                {item.count.toLocaleString()}+
              </motion.h2>
              <p className="text-md sm:text-lg font-medium mt-2 text-gray-600">{item.label}</p>

              {/* Hover Effect */}
              
            </motion.div>
          ))}
        </div>

        {/* CTA Button
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-12 px-8 py-4 bg-gradient-to-r from-sky-500 to-indigo-500 text-white rounded-full 
            font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Get Started
        </motion.button> */}
      </div>
    </section>
  );
}