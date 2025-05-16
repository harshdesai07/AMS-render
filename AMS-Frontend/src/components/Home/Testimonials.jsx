import { motion } from "framer-motion";
import { useState } from "react";

export default function Testimonials() {
  const testimonials = [
    { name: "John Doe", feedback: "AMS has made attendance tracking effortless for our team!", rating: 5 },
    { name: "Sarah Lee", feedback: "User-friendly interface and real-time updates. Highly recommended!", rating: 4 },
    { name: "Michael Chen", feedback: "Best attendance system we've used. Clean UI & powerful features!", rating: 5 },
    { name: "Emma Watson", feedback: "Very intuitive and efficient. Simplifies attendance tracking a lot!", rating: 4 },
    { name: "David Rodriguez", feedback: "The real-time analytics have transformed how we manage attendance. Outstanding system!", rating: 5 },
    { name: "Lisa Thompson", feedback: "Exceptional customer support and regular updates keep making it better. A game-changer!", rating: 5 }
  ];

  return (
    <section className="relative text-center py-20 px-6 overflow-hidden">

      {/* Section Title */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-5xl sm:text-6xl font-extrabold tracking-wide bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm"
      >
        What Users Say
      </motion.h2>

      {/* Testimonials Grid */}
      <div className="relative z-10 mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={index}
            name={testimonial.name}
            feedback={testimonial.feedback}
            rating={testimonial.rating}
          />
        ))}
      </div>
    </section>
  );
}

function TestimonialCard({ name, feedback, rating }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative p-8 bg-white rounded-2xl shadow-lg border border-gray-100 group 
      hover:shadow-xl transition-all duration-300 text-center max-w-sm mx-auto"
    >
      {/* Star Rating */}
      <div className="flex justify-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0.8 }}
            animate={{ scale: i < rating ? 1.2 : 1 }}
            className={`text-2xl ${i < rating ? "text-yellow-400" : "text-gray-400"}`}
          >
            ⭐
          </motion.span>
        ))}
      </div>

      <p className="italic text-gray-700">"{feedback}"</p>
      <h3 className="mt-4 font-bold text-lg text-gray-900">{name}</h3>

      {/* Floating Icon (similar to Hero Stats section) */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-sky-500 to-indigo-500 p-3 rounded-xl text-white shadow-lg">
        💬
      </div>
    </motion.div>
  );
}
