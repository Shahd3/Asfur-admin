
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "/src/assets/logo.png"; 


export default function Sidebar() {
    const links = [
      { to: "/", label: "Dashboard" },
      { to: "/users", label: "Users" },
      { to: "/package", label: "Package" },
      { to: "/agency", label: "Agency" },
      { to: "/offer", label: "Offer" },
      { to: "/booking", label: "Booking" },
    ];
    

  //logout:
  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in"); 
    window.location.href = "/loginPage" 
  };


  return (
    <aside className="w-64 bg-[#c7e8ea] min-h-screen p-4 shadow-md flex flex-col ">
         <div className="p-4 mb-16 flex justify-center items-center">
         <img src={logo} alt="Logo"/>
      </div>
        
      <nav className="flex flex-col space-y-5 ">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `block px-6 py-4 rounded-full font-medium text-[#0c4041] font-[lato] text-xl transition-all duration-300  font-semibold ${
                isActive
                  ? "bg-white text-[#0c4041]"
                  : "text-[#0c4041] hover:bg-white hover:bg-opacity-50"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

    </aside>
  );
}




