import { motion } from "framer-motion";
import { Mail, MapPin, Facebook, Twitter, Linkedin } from "lucide-react";

export default function ContactSection() {
  return (
    <section className="relative py-20 px-6 text-center overflow-hidden">
      
      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-16 w-14 h-14 bg-blue-200/40 blur-3xl rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-20 w-16 h-16 bg-indigo-200/30 blur-4xl rounded-full animate-pulse"></div>
      </div>
      
      {/* Contact Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl sm:text-5xl font-extrabold tracking-wide bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm"
      >
        Get in Touch
      </motion.h2>
      
      {/* Contact Info */}
      <div className="relative z-10 mt-10 flex flex-col items-center space-y-6 text-lg">
        {[
          { icon: Mail, text: "support@ams.com" },
          { icon: MapPin, text: "Bhopal, India" },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-2xl shadow-lg hover:bg-white/20 transition"
          >
            <item.icon className="text-blue-500 w-6 h-6" />
            {item.text}
          </motion.div>
        ))}
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/10 px-6 py-3 rounded-2xl shadow-lg hover:bg-white/20 transition"
        >
          📲 Connect with us
        </motion.p>
      </div>
      
      {/* Social Media Links */}
      <div className="flex justify-center space-x-6 mt-6">
        {[Facebook, Twitter, Linkedin].map((Icon, index) => (
          <motion.a
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.2, rotate: 5, color: "#3D5AFE" }}
            className="text-blue-500 text-3xl cursor-pointer transition-all duration-300 hover:text-blue-600"
            href="#"
          >
            <Icon />
          </motion.a>
        ))}
      </div>
    </section>
  );
}
