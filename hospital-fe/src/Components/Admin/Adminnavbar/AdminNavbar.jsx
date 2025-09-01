
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FaBell } from "react-icons/fa"; // 👈 Notification icon import
import "./AdminNavbar.css";

const AdminNavbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [adminData, setAdminData] = useState({
    name: "",
    profilePicture: "/images/default-profile.jpg",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        navigate("/admin/login");
        return;
      }

      try {
        const decodedToken = jwtDecode(accessToken);
        const adminId = decodedToken.userid;

        const formData = new FormData();
        formData.append("adminid", adminId);

        const response = await fetch("https://backend.medapp.transev.site/admin/getdetails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
          body: formData,
        });

        const data = await response.json();

        if (response.ok && data.data) {
          setAdminData({
            name: data.data.name,
            profilePicture: data.data.profilepicture
              ? `data:image/jpeg;base64,${data.data.profilepicture}`
              : "/images/default-profile.jpg",
          });
        } else {
          console.error("Failed to fetch admin data");
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleMyProfile = () => {
    setIsDropdownOpen(false);
    navigate("/admin-profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  const handleNotifications = () => {
    navigate("/admin/notification");
  };

  return (
    <div className="admin-navbar">
      <div className="navbar-content">
        <div className="brand-name">LifeCare Admin</div>

        <div className="admin-profile-section">
          {/* 👇 Notification icon */}
          <FaBell className="notification-icon" onClick={handleNotifications} title="Notifications" />

          <span className="admin-name">{adminData.name}</span>
          <span className="dropdown-icon" onClick={toggleDropdown}>
            ▼
          </span>

          {isDropdownOpen && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={handleMyProfile}>
                Profile Settings
              </button>
              <button className="dropdown-item" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
