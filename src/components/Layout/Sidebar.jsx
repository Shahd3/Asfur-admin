

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "/src/assets/logo.png";
import {
  FiHome,
  FiUsers,
  FiPackage,
  FiBriefcase,
  FiPercent,
  FiLogOut,
} from "react-icons/fi";

export default function Sidebar() {
  const links = [
    { to: "/", label: "Dashboard", icon: <FiHome /> },
    { to: "/users", label: "Users", icon: <FiUsers /> },
    { to: "/package", label: "Package", icon: <FiPackage /> },
    { to: "/agency", label: "Agency", icon: <FiBriefcase /> },
    { to: "/offer", label: "Offer", icon: <FiPercent /> },
  ];

  //logout:
  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in");
    window.location.href = "/loginPage"
  };


  return (
    <aside className="w-60 bg-white min-h-screen p-4 shadow flex flex-col border-r-2">
      <div className="p-4 mb-16 flex justify-center items-center">
        <img src={logo} alt="Logo" />
      </div>

      <nav className="flex flex-col space-y-8 ">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-5 px-4 py-2 rounded-xl font-medium text-[#0c4041] font-[lato] text-xl transition-all duration-300  ${isActive
                ? "bg-[#c7e8ea] text-[#0c4041]"
                : "text-[#0c4041] hover:bg-[#c7e8ea] hover:bg-opacity-50"
              }`
            }
          >
            <span className="text-xl">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

    </aside>
  );
}