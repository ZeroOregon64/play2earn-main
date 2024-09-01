import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./CSS/Topbar.css";

function TopBar({
  adminAccount,
  setIsEditingAdminAccount,
  setIsResettingPassword,
  handleLogout,
  toggleSidebar,
}) {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen((prevState) => !prevState);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const navigate = useNavigate();
  return (
    <header className="topbar">
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        ☰
      </button>
      <h1 className="dashboard-title">Admin Dashboard</h1>
      <div className="profile-dropdown" ref={dropdownRef}>
        <img
          src={adminAccount.profilePic || ""}
          alt="Admin"
          className="profile-pic"
          onClick={toggleProfileDropdown}
        />
        {isProfileDropdownOpen && (
          <div className="dropdown-menu">
            <button
              className="dropdown-item"
              onClick={() => {
                setIsEditingAdminAccount(true);
                setIsProfileDropdownOpen(false);
              }}
            >
              Edit Account
            </button>
            <button
              className="dropdown-item"
              onClick={() => {
                setIsResettingPassword(true);
                setIsProfileDropdownOpen(false);
              }}
            >
              Reset Password
            </button>
            <button
              className="dropdown-item"
              onClick={() => {
                handleLogout();
                setIsProfileDropdownOpen(false);
                navigate("/");
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default TopBar;
