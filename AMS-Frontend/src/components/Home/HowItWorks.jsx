import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    { number: "1️⃣", title: "Sign Up & Log In" },
    { number: "2️⃣", title: "Mark Attendance" },
    { number: "3️⃣", title: "View Reports" },
    { number: "4️⃣", title: "Export & Analyze" },
  ];

  return (
    <section className="relative text-center py-20 px-6 overflow-hidden">
      {/* Section Title */}
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-4xl sm:text-5xl font-extrabold tracking-wide bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm"
      >
        How It Works
      </motion.h2>

      {/* Steps Grid */}
      <div className="relative z-10 mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
        {steps.map((step, index) => (
          <StepCard key={index} number={step.number} title={step.title} />
        ))}
      </div>
    </section>
  );
}

function StepCard({ number, title }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="relative p-6 bg-white rounded-2xl shadow-lg border border-gray-100 
        group hover:shadow-xl transition-all duration-300 text-center w-full min-h-[180px] 
        flex flex-col items-center justify-center cursor-pointer"
    >
      <h3 className="text-4xl sm:text-5xl font-bold text-gray-800 drop-shadow-lg mb-4">{number}</h3>
      <p className="text-lg sm:text-xl font-semibold leading-relaxed text-gray-600">{title}</p>
    </motion.div>
  );
}
