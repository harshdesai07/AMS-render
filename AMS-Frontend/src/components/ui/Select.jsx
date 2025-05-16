import { useState } from "react";

export function Select({ onValueChange, children, required }) {
  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (e) => {
    setSelectedValue(e.target.value);
    onValueChange(e.target.value);
  };

  return (
    <div className="relative w-full">
      <select
        className="mt-1 p-2 w-full border rounded-lg focus:ring focus:ring-blue-200"
        value={selectedValue}
        onChange={handleChange}
        required={required}
      >
        {children}
      </select>
    </div>
  );
}

export function SelectTrigger({ children }) {
  return <option value="" disabled>{children}</option>;
}

export function SelectContent({ children }) {
  return <>{children}</>;
}

export function SelectItem({ value, children }) {
  return <option value={value}>{children}</option>;
}

export function SelectValue({ value }) {
  return <span className="text-gray-700">{value || "Select an option"}</span>;
}
