
import React, { useEffect, useState } from 'react';
import { FaSpinner, FaTrashAlt } from 'react-icons/fa';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';
import surveyBg from '../../Assests/background.jpg'; // Put your image here
import './Survey.css';

const API_URL = 'http://192.168.0.106:5000';

const AdminMedicalSurveyList = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const res = await fetch(`${API_URL}/ops/getallms`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch');
      setSurveys(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (uid) => {
    if (!window.confirm('Are you sure you want to delete this survey?')) return;
    const formData = new FormData();
    formData.append('uid', uid);
    try {
      const res = await fetch(`${API_URL}/ops/deletemedicalsurvey`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        alert('✅ Survey deleted successfully');
        setSurveys(prev => prev.filter(s => s.uid !== uid));
      } else {
        alert('❌ Error: ' + (data.error || data.message));
      }
    } catch {
      alert('❌ Network error or server not responding.');
    }
  };

  return (
    <div className="survey-page">
      <AdminNavbar />
      <div className="survey-layout">
        <AdminSidebar />
        <div
          className="survey-bg"
          style={{ backgroundImage: `url(${surveyBg})` }}
        >
          <div className="survey-overlay">
            <h2 className="survey-heading">Medical Survey Submissions</h2>
            {loading && (
            <div className="spinner-wrapper">
                            <FaSpinner className="loading-spinner" />
                          </div>
            )}
            {error && <p className="error-text">{error}</p>}
            {!loading && !error && surveys.length === 0 && (
              <p className="info-text">No survey data found.</p>
            )}
            {!loading && !error && surveys.length > 0 && (
              <div className="survey-card-grid">
                {surveys.map((s, i) => (
                  <div
                    key={s.uid}
                    className="survey-card"
                    style={{ backgroundColor: i % 2 === 0 ? '#f1f8e9' : '#e3f2fd' }}
                  >
                    <p><strong>Name:</strong> {s.surveyor_name}</p>
                    <p><strong>Contact:</strong> {s.surveyor_contact}</p>
                    <p><strong>House No:</strong> {s.housenumber}</p>
                    <p><strong>Ward No:</strong> {s.wardnumber}</p>
                    <p><strong>Members:</strong> {s.membercount}</p>
                    <p><strong>Guardian:</strong> {s.gurdian_of_the_house}</p>
                    <p><strong>Sick Count:</strong> {s.number_of_sick_persons}</p>
                    <p><strong>Sick Names:</strong> {s.name_of_the_sick_persons}</p>
                    <p><strong>Reason:</strong> {s.reason_of_sickness}</p>
                    <p><strong>Remedy:</strong> {s.medical_remedy}</p>
                    <p><strong>District:</strong> {s.district}</p>
                    <p><strong>Address:</strong> {s.localaddress}</p>
                    <p><strong>PS Name:</strong> {s.ps_name}</p>
                    <p><strong>Pincode:</strong> {s.pincode}</p>
                   <button
  onClick={() => handleDelete(s.uid)}
  style={{
    backgroundColor: '#e53935',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    marginTop: '1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}
>
  <FaTrashAlt />
</button>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMedicalSurveyList;
