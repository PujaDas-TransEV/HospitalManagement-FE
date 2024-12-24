import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Home from './Components/Home/Home';
import About from './Components/About/About';
import Navbar from './Components/Navbar/Navbar';
import Medicalcare from './Components/Medicalcare/Medical';
import Contact from './Components/Contact/Contact'; // Import Contact page
import Login from './Components/Authentication/Login/Login';
import Signup from './Components/Authentication/Signup/Signup';
import ForgetPassword from './Components/Authentication/ForgetPassword/Password';
import AdminSignup from './Components/Authentication/AdminSignup/AdminSignup';
import AdminLogin from './Components/Authentication/AdminLogin/AdminLogin';
import AdminPassword from './Components/Authentication/AdminForgetPassword/Password';
import SuperAdminSignup from './Components/Authentication/SuperAdminSignup/SuperAdminSignup';
import SuperAdminLogin from './Components/Authentication/SuperAdminLogin/SuperAdminLogin';
import SuperAdminForgetPassword from './Components/Authentication/SuperAdminForgetPassword/SuperAdminPassword';
// import Patientdashboard from './Components/Patients/Patientdashboard';

// Navbar component to conditionally render Navbar based on the current path
const ConditionalNavbar = () => {
  const location = useLocation();  // Get current location to conditionally render Navbar

  // Render Navbar only if the path is not '/login' or '/signup'
  return !['/login', '/signup','/password','/admin/signup','/admin/login','/admin/password','/super/admin/signup','/super/admin/login','/super/admin/password'].includes(location.pathname) && <Navbar />;
};

// Main App Component
function App() {
  return (
    <Router>
      {/* Render Navbar on top of every page except for '/login' and '/signup' */}
      <ConditionalNavbar />

      {/* Define routes for different pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/medical" element={<Medicalcare />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/password" element={<ForgetPassword />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/password" element={<AdminPassword />} />
        <Route path="/admin/password" element={<AdminPassword />} />
        <Route path="/super/admin/signup" element={<SuperAdminSignup />} />
        <Route path="/super/admin/login" element={<SuperAdminLogin />} />
        <Route path="/super/admin/password" element={<SuperAdminForgetPassword />} />
        {/* <Route path="patient-dashboard" element={<Patientdashboard />} />  */}
        {/* Add other routes as needed */}
      </Routes>

      {/* Footer at the bottom of every page */}
      {/* <Footer /> */}
    </Router>
  );
}

export default App;
