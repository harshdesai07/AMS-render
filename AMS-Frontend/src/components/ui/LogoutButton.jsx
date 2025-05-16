import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/"); // Redirect to Home page
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center space-x-2 px-4 py-2 rounded-md 
                 bg-[#0d0d2b] text-white border border-white 
                 hover:bg-[#1a1a40] hover:text-gray-300 transition-colors cursor-pointer"
    >
      <span>Logout</span>
    </button>
  );
}