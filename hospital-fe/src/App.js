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
import SuperAdminForgotPassword from './Components/Authentication/SuperAdminForgetPassword/SuperAdminPassword';
import PatientNavbar from './Components/Patients/Navbar/PatientNavbar';
import PatientSidebar from './Components/Patients/Sidebar/PatientSidebar';
import Patientdashboard from './Components/Patients/PatientDashboard/PatientDashboard';
import HealthOverview from './Components/Patients/HealthOverview/Health';
import Appointments from './Components/Patients/Appointments/Appointment'
import PatientProfile from './Components/Patients/MyProfile/MyProfile';
import PatientSettings from './Components/Patients/Settings/PatientSettings';
import DoctorDashboard from './Components/Doctors/DoctorDashboard/Dashboard';

import AdminNavbar from './Components/Admin/Adminnavbar/AdminNavbar';
import AdminSidebar from './Components/Admin/Adminsidebar/AdminSidebar';
import AdminDashboard from './Components/Admin/AdminDashboard/Dashboard';
import ManageDoctors from './Components/Admin/ManageDoctor/ManageDoctor';
import DoctorSignup from './Components/Authentication/DoctorSignup/DoctorSignup';
import DoctorLogin from './Components/Authentication/DoctorLogin/DoctorLogin';
import DoctorForgetPassword from './Components/Authentication/DoctorForgetPassword/DoctorForgetPassword';
import DepartmentPage from './Components/Admin/ManageDoctor/DepartmentPage/Department';
import ManagePatient from './Components/Admin/ManagePatient/ManagePatient';
import AdminProfile from './Components/Admin/AdminProfile/AdminProfile';
import AdminSettings from './Components/Admin/Admin Settings/AdminSettings';
import DoctorNavbar from './Components/Doctors/DoctorNavbar/DoctorNAvbar';
import DoctorSidebar from './Components/Doctors/DoctorSidebar/Doctorsidebar';
import DoctorLeave from './Components/Doctors/DoctorLeave/Leave';
import DoctorProfile from './Components/Doctors/DoctorProfile/DoctorProfile';
import DoctorSettings from './Components/Doctors/DoctorSettings/DoctorSettings';
import AppointmentManagement from './Components/Admin/AppointmentManagement/AppointmentManagement';
import DoctorAppointment from './Components/Doctors/DoctorAppointment/DoctorAppointment';
import DepartmentwisebookAppointment from './Components/Patients/Departmentwisebookappointment/Departmentwisebook';
import AdminAppointBookDepartmentwise from './Components/Admin/AdminDepartmentwiseAppointmentBook/AdminAppointmentBook';
import PatientDepartmnetwiseList from './Components/Admin/DepartmetwisePatientsList/DepartmentwisePatientsList';
import PatientList from './Components/Doctors/PatientList/PatientList';
import Prescription from './Components/Patients/Prescription/Prescription';
import AdminPrescription from './Components/Admin/PrescriptionReports/PrescriptionAdmin';
import AdminFacilityManagement from './Components/Admin/FacilityManagement/FacilityManagement';
import AdminWardManagement from './Components/Admin/WardManagement/WardManagement';
import AdminRoomManagement from './Components/Admin/RoomManagement/RoomManagement';
import PatientAdmissionPage from './Components/Admin/PatientAdmission/PatientAdmission';
import PatientMedicalHistory from './Components/Patients/MedicalHistory/Medical';
import AdminEquipmentManagement from './Components/Admin/EquipmentManagement/EquipmentManagement';
import AdminStaffManagement from './Components/Admin/StaffManagement/StaffManagement'; 



// Navbar component to conditionally render Navbar based on the current path
const ConditionalNavbar = () => {
  const location = useLocation();  // Get current location to conditionally render Navbar

  // Render Navbar only if the path is not '/login' or '/signup'
  return !['/login', '/signup','/password','/admin/signup','/admin/login','/admin/password','/super/admin/signup','/super/admin/login','/super/admin/password','/patient-dashboard','/patient-Appointments','/profile','/settings','/dprofile','/doctordashboard','/adnavbar','/adsidebar','/ad-dashboard','/manage-doctors','/doctor-signup','/doctor-login','/doctors/:specialization','/doctors/Cardiology','/doctors/Neurology','/doctors/Pediatrics','/doctors/Orthopedics','/doctors/Infectious%20Diseases','/doctor-password','/manage-patients','/admin-settings','/doctor-navbar','/doctor-sidebar','/leave','/doctor-profile','/doctor-settings','/admin-profile','/appointment-management','/appointments','/appointment/:departmentId','/appointment/cardiology','/appointment/pediatrics','/appointment/neurology','/appointment/orthopedics','/appointment/dermatology','/appointment/surgery','/admin/appointments/cardiology','/patients/Cardiology','/patients/Neurology','/patients/Orthopedics','/patients/Dermatology','/patients/Pediatrics','/patients','/prescription','/reportsprescription','/facility-management','/ward-management','/room-management','/patient-admission','/medical-history','/equipment-management','/staff-management'].includes(location.pathname) && <Navbar />;
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
        <Route path="/super/admin/signup" element={<SuperAdminSignup />} />
        <Route path="/super/admin/login" element={<SuperAdminLogin />} />
        <Route path="/super/admin/password" element={<SuperAdminForgotPassword />} />
        <Route path="/patient-navbar" element={<PatientNavbar />} />
        <Route path="/patient-sidebar" element={<PatientSidebar />} />
        <Route path="/patient-dashboard" element={<Patientdashboard />} /> 
        <Route path="/patient-health" element={<HealthOverview/>} /> 
        <Route path="/patient-Appointments" element={<Appointments/>} /> 
        <Route path="/profile" element={<PatientProfile/>} /> 
        <Route path="/settings" element={<PatientSettings/>} />
        <Route path="/doctordashboard" element={<DoctorDashboard/>} /> 
        <Route path="/dprofile" element={<DoctorProfile/>} />  
        <Route path="/adnavbar" element={<AdminNavbar/>} />  
        <Route path="/adsidebar" element={<AdminSidebar/>} />
        <Route path="/ad-dashboard" element={<AdminDashboard/>} />  
        <Route path="/manage-doctors" element={<ManageDoctors/>} />  
        <Route path="/doctor-signup" element={<DoctorSignup/>} />  
        <Route path="/doctor-login" element={<DoctorLogin/>} />  
        <Route path="/doctors/:specialization" element={<DepartmentPage />} />
        <Route path="/doctor-password" element={<DoctorForgetPassword/>} /> 
        <Route path="/manage-patients" element={<ManagePatient/>} />
        <Route path="/admin-profile" element={<AdminProfile/>} />
        <Route path="/admin-settings" element={<AdminSettings/>} />
        <Route path="/doctor-navbar" element={<DoctorNavbar/>} />
        <Route path="/doctor-sidebar" element={<DoctorSidebar/>} />
        <Route path="/leave" element={<DoctorLeave/>} />
        <Route path="/doctor-profile" element={<DoctorProfile/>} />
        <Route path="/doctor-settings" element={<DoctorSettings/>} />
        <Route path="/appointment-management" element={<AppointmentManagement/>} />
        <Route path="/appointments" element={<DoctorAppointment/>} />
        <Route path="/appointment/:departmentId" element={<DepartmentwisebookAppointment />} />
        <Route path="/admin/appointments/:departmentId" element={<AdminAppointBookDepartmentwise />} />
        <Route path="/patients/:specialization" element={<PatientDepartmnetwiseList/>} />
        <Route path="/patients" element={<PatientList/>} />
        <Route path="/prescription" element={<Prescription/>} />
        <Route path="/reportsprescription" element={<AdminPrescription/>} />
        <Route path="/facility-management" element={<AdminFacilityManagement/>} />
        <Route path="/ward-management" element={<AdminWardManagement/>} />
        <Route path="/room-management" element={<AdminRoomManagement/>} />
        <Route path="/patient-admission" element={<PatientAdmissionPage/>} />
        <Route path="/medical-history" element={<PatientMedicalHistory/>} />
        <Route path="/equipment-management" element={<AdminEquipmentManagement/>} />
        <Route path="/staff-management" element={<AdminStaffManagement/>} />

        
     
        {/* Add other routes as needed */}
      </Routes>

      {/* Footer at the bottom of every page */}
      {/* <Footer /> */}
    </Router>
  );
}

export default App;


