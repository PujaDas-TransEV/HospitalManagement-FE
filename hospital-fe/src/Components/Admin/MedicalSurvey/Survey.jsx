import React, { useEffect, useState } from 'react';
import './Survey.css'; // Your CSS file
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';

const AdminMedicalSurveyList = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSurveys();
  }, []);

  // Fetch all medical surveys
  const fetchSurveys = async () => {
    try {
      const res = await fetch('http://192.168.0.106:5000/ops/getallms');
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch data');
      }

      setSurveys(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete a specific survey by uid
  const handleDelete = async (uid) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this survey?');
    if (!confirmDelete) return;

    const formData = new FormData();
    formData.append('uid', uid);

    try {
      const res = await fetch('http://localhost:5000/ops/deletemedicalsurvey', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        alert('✅ Survey deleted successfully');
        setSurveys((prev) => prev.filter((s) => s.uid !== uid));
      } else {
        alert('❌ Error: ' + result.error);
      }
    } catch (err) {
      console.error(err);
      alert('❌ Network error or server not responding.');
    }
  };

  return (
    <div className="prescription-wrapper">
      <AdminNavbar />
      <div className="main-content">
        <AdminSidebar />
        <div className="admin-survey-container">
          <div className="survey-content">
            <h2>Medical Survey Submissions</h2>

            {loading && <p className="info-text">Loading surveys...</p>}
            {error && <p className="error-text">{error}</p>}

            {!loading && !error && surveys.length === 0 && (
              <p className="info-text">No survey data found.</p>
            )}

            {!loading && !error && surveys.length > 0 && (
              <div className="table-wrapper">
                <table className="survey-table">
                  <thead>
                    <tr>
                      <th>Surveyor Name</th>
                      <th>Contact</th>
                      <th>House Number</th>
                      <th>Ward Number</th>
                      <th>Member Count</th>
                      <th>Guardian of House</th>
                      <th>Sick Persons Count</th>
                      <th>Name of Sick Persons</th>
                      <th>Reason of Sickness</th>
                      <th>Medical Remedy</th>
                      <th>District</th>
                      <th>Local Address</th>
                      <th>PS Name</th>
                      <th>Pincode</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {surveys.map((survey) => (
                      <tr key={survey.uid}>
                        <td>{survey.surveyor_name}</td>
                        <td>{survey.surveyor_contact}</td>
                        <td>{survey.housenumber}</td>
                        <td>{survey.wardnumber}</td>
                        <td>{survey.membercount}</td>
                        <td>{survey.gurdian_of_the_house}</td>
                        <td>{survey.number_of_sick_persons}</td>
                        <td>{survey.name_of_the_sick_persons}</td>
                        <td>{survey.reason_of_sickness}</td>
                        <td>{survey.medical_remedy}</td>
                        <td>{survey.district}</td>
                        <td>{survey.localaddress}</td>
                        <td>{survey.ps_name}</td>
                        <td>{survey.pincode}</td>
                        <td>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(survey.uid)}
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMedicalSurveyList;
