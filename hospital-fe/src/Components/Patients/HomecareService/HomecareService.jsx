
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './HomecareService.css';
import PatientNavbar from '../Navbar/PatientNavbar';
import PatientSidebar from '../Sidebar/PatientSidebar';
import { useNavigate } from 'react-router-dom';

const HomeCareService = () => {
  const [formData, setFormData] = useState({
    patientname: '',
    patientdetails: '',
    patientphonenum: '',
    patinetaddress: '',
    patientientguardian: '',
    patientientguardianphno: '',
    refrencedoctorname: '',
    patientid: '',
    timefrom: '',
    timeto: '',
    reason: '',
    status: 'scheduled',
    doctorid: '',
    caretype: '',
    assignedstaffid: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  // Track loading spinner per field (here only doctor select)
  const [fieldLoading, setFieldLoading] = useState({
    refrencedoctorname: false,
  });

  const navigate = useNavigate();

  // Fetch patient profile on mount
  useEffect(() => {
    const fetchPatientProfile = async () => {
      const patientId = localStorage.getItem('patientId');
      if (!patientId) return;

      try {
        const formDataPayload = new FormData();
        formDataPayload.append('patientid', patientId);

        const response = await axios.post(
          'http://192.168.0.106:5000/patients/profile/getbyid',
          formDataPayload,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        const data = response.data.data;

        setFormData(prev => ({
          ...prev,
          patientid: patientId,
          patientname: `${data.firstname} ${data.lastname}`,
          patientdetails: `Blood Group: ${data.bloodgroup}, Age: ${data.age}, Gender: ${data.gender}, DOB: ${data.dob}`,
          patientphonenum: data.phonenumber || '',
          patinetaddress: data.address || '',
        }));
      } catch (error) {
        console.error('Failed to fetch patient profile:', error);
      }
    };

    fetchPatientProfile();
  }, []);

  // Fetch doctors when caretype is doctor
  useEffect(() => {
    if (formData.caretype === 'doctor') {
      setFieldLoading(prev => ({ ...prev, refrencedoctorname: true }));
      axios.get('http://192.168.0.106:5000/doctorops/getalldoctor')
        .then(response => {
          const doctorOptions = response.data.data.map(doctor => ({
            value: doctor.fullname,
            label: `${doctor.fullname} (${doctor.specialization})`
          }));
          setDoctors(doctorOptions);
        })
        .catch(error => {
          console.error('Error fetching doctors:', error);
        })
        .finally(() => {
          setFieldLoading(prev => ({ ...prev, refrencedoctorname: false }));
        });
    }
  }, [formData.caretype]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selectedOption) => {
    setFormData(prev => ({ ...prev, refrencedoctorname: selectedOption?.value || '' }));
  };

  // Format datetime-local value to "YYYY-MM-DD HH:MM:SS"
  const formatDateTime = (value) => {
    const date = new Date(value);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = '00';
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formPayload = new FormData();
      for (let key in formData) {
        let value = formData[key];
        if (key === 'timefrom' || key === 'timeto') {
          value = formatDateTime(value);
        }
        formPayload.append(key, value);
      }

      await axios.post('http://192.168.0.106:5000/management/homecare', formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSubmitted(true);
      alert('✅ Home care service request submitted!');
      setFormData({
        patientname: '',
        patientdetails: '',
        patientphonenum: '',
        patinetaddress: '',
        patientientguardian: '',
        patientientguardianphno: '',
        refrencedoctorname: '',
        patientid: '',
        timefrom: '',
        timeto: '',
        reason: '',
        status: 'scheduled',
        doctorid: '',
        caretype: '',
        assignedstaffid: ''
      });
      navigate('/home-care-service');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('❌ Failed to submit the request.');
    }
  };

  return (
    <div className="dashboard-containerr">
      {/* Navbar */}
      <PatientNavbar />

      <div className="dashboard-contenterr">
        {/* Sidebar */}
        <PatientSidebar />

        {/* Overlay container */}
        <div className="homecare-overlay">
          <div className="homecare-containerr">
            <div className="homecare-box">
              <h2>🏠 Book Home Care Service</h2>

              {submitted && <div className="success-message">Request submitted successfully!</div>}

              <form className="homecare-form" onSubmit={handleSubmit}>

                <label>
                  Care Type:
                  <select
                    name="caretype"
                    value={formData.caretype}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Care Type --</option>
                    <option value="doctor">Doctor Visit</option>
                    <option value="nurse">Nursing</option>
                    <option value="physiotherapy">Physiotherapy</option>
                    <option value="equipment">Medical Equipment Rental</option>
                  </select>
                </label>

                {/* {formData.caretype === 'doctor' && (
                  <label className="select-with-spinner">
                    Reference Doctor Name:
                    <Select
                      options={doctors}
                      value={doctors.find(doc => doc.value === formData.refrencedoctorname) || null}
                      onChange={handleSelectChange}
                      isLoading={loadingDoctors}
                      placeholder="Select a doctor"
                      classNamePrefix="react-select"
                    />
                    {fieldLoading.refrencedoctorname && <div className="small-spinner"></div>}
                  </label>
                )} */}
{formData.caretype === 'doctor' && (
  <label className="select-with-spinner">
    Reference Doctor Name:
    <Select
      options={doctors.map(doc => ({
        ...doc,
        label: `Dr. ${doc.label?.replace(/^Dr\.?\s*/i, '')}` // Ensure no duplicate "Dr."
      }))}
      value={
        doctors
          .map(doc => ({
            ...doc,
            label: `Dr. ${doc.label?.replace(/^Dr\.?\s*/i, '')}`
          }))
          .find(doc => doc.value === formData.refrencedoctorname) || null
      }
      onChange={handleSelectChange}
      isLoading={loadingDoctors}
      placeholder="Select a doctor"
      classNamePrefix="react-select"
    />
    {fieldLoading.refrencedoctorname && <div className="small-spinner"></div>}
  </label>
)}

                <label>
                  Patient Name:
                  <input
                    type="text"
                    name="patientname"
                    value={formData.patientname}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Patient Details:
                  <textarea
                    name="patientdetails"
                    value={formData.patientdetails}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Patient Phone Number:
                  <input
                    type="tel"
                    name="patientphonenum"
                    value={formData.patientphonenum}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Patient Address:
                  <textarea
                    name="patinetaddress"
                    value={formData.patinetaddress}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Guardian Name:
                  <input
                    type="text"
                    name="patientientguardian"
                    value={formData.patientientguardian}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Guardian Phone Number:
                  <input
                    type="tel"
                    name="patientientguardianphno"
                    value={formData.patientientguardianphno}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Patient ID:
                  <input
                    type="text"
                    name="patientid"
                    value={formData.patientid}
                    readOnly
                  />
                </label>

                <label>
                  Time From:
                  <input
                    type="datetime-local"
                    name="timefrom"
                    value={formData.timefrom}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Time To:
                  <input
                    type="datetime-local"
                    name="timeto"
                    value={formData.timeto}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Reason:
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                  />
                </label>

              
                <button
  type="submit"
  style={{
    display: 'block',        
    margin: '0 auto',        
    width: '260px',         
    padding: '10px',       
  }}
>
  Submit Request
</button>

              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomeCareService;
