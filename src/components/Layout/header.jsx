import { NavLink } from "react-router-dom";
import React, { useState } from "react";
import { FiBell } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";



export default function Header() {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in");
    localStorage.removeItem("token");
    localStorage.setItem("isLoggedIn", "false")
    window.location.href = "/";
  };

  const adminName = "Admin Username";

  // Optional: close dropdown if clicked outside
  const handleClickOutside = (e) => {
    if (!e.target.closest("#profile-area")) {
      setShowDropdown(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow px-6 py-3 flex justify-between items-center relative">
      {/* LEFT: Search bar */}
      <div className="flex-1 max-w-md">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0c4041]"
        />
      </div>

      {/* RIGHT: Profile and Notification */}
      <div className="flex items-center space-x-4 ml-auto">
        {/* Notification button */}
        <button className="text-gray-600 hover:text-gray-800">
          <FiBell size={20} />
        </button>

        {/* Profile area */}
        <div
          id="profile-area"
          className="relative"
        >
          <img
            src="src/assets/profile.png"
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover cursor-pointer"
            onClick={() => setShowDropdown((prev) => !prev)}
          />

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-50 p-3">
              <p className="font-medium text-gray-800 mb-2">{adminName}</p>
              <button
                onClick={handleLogout}
                className="w-full flex items-center text-left pl-1 mt-4 text-sm text-red-600 hover:text-red-800 space-x-2"
              >
                <FiLogOut size={16} />
                <span>Logout</span>
              </button>

            </div>
          )}
        </div>
      </div>
    </header>
  );
}
