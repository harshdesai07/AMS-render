export function Button({ children, onClick, variant = "default", className = "" }) {
  const baseStyles =
    "px-4 py-2 rounded-lg font-medium transition focus:outline-none cursor-pointer";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-400 text-gray-700 hover:bg-gray-200",
    destructive: "bg-red-500 text-white hover:bg-red-600",
    success: "bg-green-500 text-white hover:bg-green-600",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant] || ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
