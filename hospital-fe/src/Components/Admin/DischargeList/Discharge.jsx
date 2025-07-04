
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSpinner, FaTrash } from "react-icons/fa";
import AdminNavbar from "../Adminnavbar/AdminNavbar";
import AdminSidebar from "../Adminsidebar/AdminSidebar";

const DischargeListPage = () => {
  const [dischargeData, setDischargeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingEmail, setDeletingEmail] = useState(null);

  useEffect(() => {
    fetchDischargeData();
  }, []);

  const fetchDischargeData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:5000/discharge/getallpadops");
      if (res.data && res.data.data) {
        setDischargeData(res.data.data);
      } else {
        setError("No discharge data found.");
      }
    } catch {
      setError("Failed to fetch discharge data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (patientemailid) => {
    if (!window.confirm("Are you sure you want to delete this discharge record?")) return;

    setDeletingEmail(patientemailid);
    const formData = new FormData();
    formData.append("patientemailid", patientemailid);

    try {
      await axios.post("http://localhost:5000/discharge/deletepadops", formData);
      setDischargeData((prev) =>
        prev.filter((item) => item.patientemailid !== patientemailid)
      );
    } catch {
      alert("Failed to delete discharge record.");
    } finally {
      setDeletingEmail(null);
    }
  };

  const tdStyle = {
    padding: "10px 8px",
    fontSize: "14px",
    color: "#ddd",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  };

  return (
    <div className="ptadm-wrapperr">
      <AdminNavbar />
      <div className="ptadm-contentt">
        <AdminSidebar />
        <div
          style={{
            minHeight: "100vh",
            backgroundImage: "url('https://www.transparenttextures.com/patterns/black-linen.png')",
            backgroundSize: "cover",
            backgroundColor: "#0c1c2c",
            padding: "40px 20px",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            color: "#fff",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              marginBottom: "30px",
              textShadow: "1px 1px 4px #000",
            }}
          >
            All Discharge List
          </h1>

          {loading ? (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
              <FaSpinner className="spin" style={{ fontSize: "40px", color: "#1e88e5" }} />
              <p style={{ fontSize: "18px", marginTop: "10px" }}>Loading discharge data...</p>
            </div>
          ) : error ? (
            <p style={{ textAlign: "center", color: "#ff6b6b", fontWeight: "bold" }}>{error}</p>
          ) : dischargeData.length === 0 ? (
            <p style={{ textAlign: "center" }}>No discharge records found.</p>
          ) : (
            <div style={{ overflowX: "auto", maxWidth: "100%", margin: "0 auto" }}>
              <table
                style={{
                  width: "100%",
                  maxWidth: "1000px",
                  margin: "0 auto",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderCollapse: "collapse",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 0 12px rgba(0, 0, 0, 0.3)",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#1e88e5", color: "#fff" }}>
                    {[
                      "Disease Name",
                      "Disease Type",
                      "Doctor Email",
                      "Discharge Date",
                      "Discharge Time",
                      "Patient Email",
                      "Health Status",
                      "Action",
                    ].map((heading) => (
                      <th
                        key={heading}
                        style={{
                          padding: "12px 8px",
                          fontSize: "15px",
                          textAlign: "left",
                          borderBottom: "1px solid #ccc",
                        }}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dischargeData.map((item) => (
                    <tr key={item.uid}>
                      <td style={tdStyle}>{item.deaseasename}</td>
                      <td style={tdStyle}>{item.deaseasestype}</td>
                      <td style={tdStyle}>{item.doctoremailid}</td>
                      <td style={tdStyle}>{item.patientdischarge_date}</td>
                      <td style={tdStyle}>{item.patientdischarge_time}</td>
                      <td style={tdStyle}>{item.patientemailid}</td>
                      <td style={tdStyle}>{item.patienthealth_status}</td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => handleDelete(item.patientemailid)}
                          disabled={deletingEmail === item.patientemailid}
                          style={{
                            backgroundColor: "#e53935",
                            border: "none",
                            color: "#fff",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            cursor:
                              deletingEmail === item.patientemailid
                                ? "not-allowed"
                                : "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "13px",
                          }}
                        >
                          {/* {deletingEmail === item.patientemailid ? (
                            <>
                              <FaSpinner className="spin" />
                              Deleting...
                            </>
                          ) : ( */}
                            <>
                              <FaTrash />
                              Delete
                            </>
                          {/* )} */}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Spinner animation */}
          <style>
            {`
              .spin {
                animation: spin 1s linear infinite;
              }
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      </div>
    </div>
  );
};

export default DischargeListPage;
