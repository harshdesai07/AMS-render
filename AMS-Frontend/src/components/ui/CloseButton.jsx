import { X } from "lucide-react";
import PropTypes from "prop-types";

export default function CloseButton({ onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-full bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 transform hover:scale-110 active:scale-95 group shadow-sm hover:shadow-md ${className} cursor-pointer`}
      aria-label="Close form"
    >
      <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
    </button>
  );
}

CloseButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};