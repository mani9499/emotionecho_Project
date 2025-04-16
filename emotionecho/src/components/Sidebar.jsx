import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./sidebar.css";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("User");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        if (userObj.given_name) {
          setUserName(userObj.given_name);
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    document.body.style.overflow = isOpen ? "auto" : "hidden"; // Prevent scrolling when open
  };

  const closeSidebar = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto"; // Restore scrolling
  };

  const logout = () => {
    if (!window.confirm("Are You Sure You Want to Log Out?")) return;

    console.log("Logging out...");
    localStorage.removeItem("user");

    if (window.gapi?.auth2?.getAuthInstance()) {
      window.gapi.auth2
        .getAuthInstance()
        .signOut()
        .then(() => {
          console.log("User signed out from Google OAuth");
        });
    }

    navigate("/");
  };

  return (
    <>
      <button className="menu-button" onClick={toggleSidebar}>
        {isOpen ? "✖" : "☰"}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="profile-section">
          <button onClick={logout}>
            <i className="ri-user-3-fill profile-icon"></i>
            <strong>{userName}</strong>
          </button>
        </div>

        <div className="sidebar-options">
          <h2 style={{ color: "white" }}>Menu</h2>
          <ul>
            {[
              { name: "Home", path: "/home", icon: "ri-home-4-line" },
              { name: "About", path: "/about", icon: "ri-information-line" },
              { name: "Contact", path: "/contact", icon: "ri-phone-line" },
            ].map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={location.pathname === item.path ? "active" : ""}
                  onClick={closeSidebar} // Close sidebar on link click
                >
                  <span className="sidebar-item">
                    <i className={item.icon}></i>
                    <span>{item.name}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sidebar Overlay (Clicking outside closes it) */}
      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
    </>
  );
}
