

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  FiLock,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import "./PatientSettings.css";
import PatientNavbar from "../Navbar/PatientNavbar";
import PatientSidebar from "../Sidebar/PatientSidebar";
import backgroundImage from "../../Assests/background.jpg";

const PatientSettings = () => {
  const navigate = useNavigate();


  const [isDeleteConfirmed, setIsDeleteConfirmed] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

 
  const handleChangePassword = () => setIsPasswordModalOpen(true);
  const handleDeleteAccount = () => setIsDeleteModalOpen(true);


  const confirmPasswordChange = () => {
    setIsPasswordModalOpen(false);
    navigate("/password");
  };

  
  const confirmAccountDeletion = async () => {
    setIsDeleteModalOpen(false);

    if (!isDeleteConfirmed) return;

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setErrorMessage("No access token found. Please log in again.");
        return;
      }

      const decodedToken = jwtDecode(accessToken);
      const patientId = decodedToken.userid;
      const formData = new FormData();
      formData.append("patientid", patientId);

      const response = await fetch("http://192.168.0.106:5000/patientops/deleteprofile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Your account has been deleted successfully.");
        setErrorMessage(null);
       
        localStorage.removeItem("accessToken");
        setTimeout(() => navigate("/"), 3000);
      } else {
        setErrorMessage(data.message || "Failed to delete account.");
        setSuccessMessage(null);
      }
    } catch (error) {
      setErrorMessage("An error occurred while deleting your account.");
      setSuccessMessage(null);
    }
  };


  const closeModal = () => {
    setIsPasswordModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  return (
    <div
      className="dashboard-container-settings"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <PatientNavbar />
      <div className="dashboard-content-settings">
        <PatientSidebar />
        <div className="settings-container-patient">
          <h1 className="settings-title">Patient Settings</h1>

         
          <div
            className="settings-section password-section"
            style={{ backgroundColor: "rgba(215, 216, 136, 0.9)" }}
          >
            <h2 className="section-title">
              <FiLock className="icon" /> Change Password
            </h2>
            <p>
              To change your password, click the button below. You will be redirected to the
              "Forgot Password" page where you can reset it.
            </p>
            <button className="action-button" onClick={handleChangePassword}>
              Change Password
            </button>
          </div>

         
          <div
            className="settings-section delete-section"
            style={{ backgroundColor: "rgba(126, 172, 180, 0.9)" }}
          >
            <h2 className="section-title">
              <FiTrash2 className="icon delete-icon" /> Delete Account
            </h2>
            <p>
              If you wish to delete your account, please toggle the option below to confirm.
            </p>
            <div className="toggle-container">
              <label htmlFor="delete-toggle" className="toggle-label">
                Confirm Account Deletion:
              </label>
              <input
                type="checkbox"
                id="delete-toggle"
                checked={isDeleteConfirmed}
                onChange={() => setIsDeleteConfirmed(!isDeleteConfirmed)}
                className="toggle-checkbox"
              />
            </div>
            {isDeleteConfirmed && (
              <button className="delete-button-settings" onClick={handleDeleteAccount}>
                Confirm Delete Account
              </button>
            )}
          </div>

       
          {errorMessage && (
            <div className="error-message">
              <FiXCircle className="message-icon" /> {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="success-message">
              <FiCheckCircle className="message-icon" /> {successMessage}
            </div>
          )}

      
          {isPasswordModalOpen && (
            <div className="modal-overlay-settings">
              <div className="modal-settings">
                <h3>Are you sure you want to change your password?</h3>
                <div className="modal-buttons">
                  <button className="modal-button confirm" onClick={confirmPasswordChange}>
                    Yes
                  </button>
                  <button className="modal-button cancel" onClick={closeModal}>
                    No
                  </button>
                </div>
              </div>
            </div>
          )}

      
          {isDeleteModalOpen && (
            <div className="modal-overlay-settings">
              <div className="modal-settings">
                <h3>Are you sure you want to delete your account?</h3>
                <div className="modal-buttons">
                  <button className="modal-button confirm" onClick={confirmAccountDeletion}>
                    Yes
                  </button>
                  <button className="modal-button cancel" onClick={closeModal}>
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientSettings;
