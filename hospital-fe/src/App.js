import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './Components/Home/Home'; // Import Home page


// Main App Component
function App() {
  return (
    <Router>
      {/* Render Navbar on top of every page */}
     

      {/* Define routes for different pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Add other routes as needed */}
      </Routes>

      {/* Footer at the bottom of every page */}
      {/* <Footer /> */}
    </Router>
  );
}

export default App;
