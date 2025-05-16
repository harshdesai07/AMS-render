export function Input({ type = "text", className, ...props }) {
    return (
      <input
        type={type}
        className={`mt-1 p-2 w-full border rounded-lg focus:ring focus:ring-blue-200 ${className}`}
        {...props}
      />
    );
  }
  