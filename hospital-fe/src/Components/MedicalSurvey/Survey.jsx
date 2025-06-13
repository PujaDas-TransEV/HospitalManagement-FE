import React, { useState } from 'react';
import './Survey.css'; // create this for styling if you want

const MedicalSurveyPage = () => {
  const [formData, setFormData] = useState({
    surveyor_name: '',
    surveyor_contact: '',
    housenumber: '',
    wardnumber: '',
    membercount: '',
    gurdian_of_the_house: '',
    number_of_sick_persons: '',
    name_of_the_sick_persons: '',
    reason_of_sickness: '',
    medical_remedy: '',
    district: '',
    localaddress: '',
    ps_name: '',
    pincode: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setErrorMsg('');
  setSuccessMsg('');

  try {
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });

    const response = await fetch('http://192.168.0.106:5000/ops/createmsurvey', {
      method: 'POST',
      body: form,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit survey');
    }

    setSuccessMsg('Medical survey submitted successfully!');
    setFormData({
      surveyor_name: '',
      surveyor_contact: '',
      housenumber: '',
      wardnumber: '',
      membercount: '',
      gurdian_of_the_house: '',
      number_of_sick_persons: '',
      name_of_the_sick_persons: '',
      reason_of_sickness: '',
      medical_remedy: '',
      district: '',
      localaddress: '',
      ps_name: '',
      pincode: '',
    });
  } catch (error) {
    setErrorMsg(error.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="medical-survey-container">
      <h2>Medical Survey Form</h2>

      <form className="survey-form" onSubmit={handleSubmit}>
        <label>
         Name:
          <input
            type="text"
            name="surveyor_name"
            value={formData.surveyor_name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
         Contact:
          <input
            type="tel"
            name="surveyor_contact"
            value={formData.surveyor_contact}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          House Number:
          <input
            type="text"
            name="housenumber"
            value={formData.housenumber}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Ward Number:
          <input
            type="text"
            name="wardnumber"
            value={formData.wardnumber}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Member Count:
          <input
            type="number"
            name="membercount"
            value={formData.membercount}
            onChange={handleChange}
            min="0"
            required
          />
        </label>

        <label>
          Guardian of the House:
          <input
            type="text"
            name="gurdian_of_the_house"
            value={formData.gurdian_of_the_house}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Number of Sick Persons:
          <input
            type="number"
            name="number_of_sick_persons"
            value={formData.number_of_sick_persons}
            onChange={handleChange}
            min="0"
            required
          />
        </label>

        <label>
          Name of Sick Persons:
          <textarea
            name="name_of_the_sick_persons"
            value={formData.name_of_the_sick_persons}
            onChange={handleChange}
            placeholder="Separate multiple names with commas"
            required
          />
        </label>

        <label>
          Reason of Sickness:
          <textarea
            name="reason_of_sickness"
            value={formData.reason_of_sickness}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Medical Remedy:
          <textarea
            name="medical_remedy"
            value={formData.medical_remedy}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          District:
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Local Address:
          <input
            type="text"
            name="localaddress"
            value={formData.localaddress}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          PS Name:
          <input
            type="text"
            name="ps_name"
            value={formData.ps_name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Pincode:
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Survey'}
        </button>
      </form>

      {successMsg && <p className="success-message">{successMsg}</p>}
      {errorMsg && <p className="error-message">{errorMsg}</p>}
    </div>
  );
};

export default MedicalSurveyPage;
