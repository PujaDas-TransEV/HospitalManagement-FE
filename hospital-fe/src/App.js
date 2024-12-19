import React from 'react';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import CustomNavbar from './Components/Navbar/Navbar'; // Import Navbar component

// Main App Component
function App() {
  return (
    <Router>
      {/* Render Navbar on top of every page */}
      <CustomNavbar />

      {/* Define routes for different pages */}
      <Routes>
      
       
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
