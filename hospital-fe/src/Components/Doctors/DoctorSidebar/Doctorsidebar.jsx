// import React, { useState } from 'react';
// import { Nav, Button } from 'react-bootstrap';
// import { FaCalendar, FaList, FaEnvelope, FaCog, FaBars, FaCalendarCheck } from 'react-icons/fa'; // FaCalendarCheck added for leave icon
// import './Doctorsidebar.css'; // Custom styling

// const Sidebar = () => {
//   const [collapsed, setCollapsed] = useState(true); // Initial state is collapsed

//   // Toggle sidebar between collapsed and expanded
//   const handleToggle = () => {
//     setCollapsed(!collapsed);
//   };

//   return (
//     <div className={`sidebar ${collapsed ? 'collapsed' : 'expanded'}`}>
//       <div className="sidebar-header">
//         {/* Toggle button */}
//         <Button variant="link" onClick={handleToggle} className="toggle-button-doctor">
//           <FaBars />
//         </Button>
//         <h3 className="sidebar-title">{collapsed ? '' : "Doctor's Panel"}</h3>
//       </div>

//       <Nav className="flex-column">
//         <Nav.Link href="/doctor-dashboard" className="sidebar-item">
//           <FaCalendar />
//           {!collapsed && ' Dashboard'}
//         </Nav.Link>
//         <Nav.Link href="/appointments" className="sidebar-item">
//           <FaList />
//           {!collapsed && ' Appointments'}
//         </Nav.Link>
//         <Nav.Link href="/patients" className="sidebar-item">
//           <FaList />
//           {!collapsed && ' Patient List'}
//         </Nav.Link>
//         <Nav.Link href="/messages" className="sidebar-item">
//           <FaEnvelope />
//           {!collapsed && ' Messages'}
//         </Nav.Link>
//         <Nav.Link href="/leave" className="sidebar-item">
//           <FaCalendarCheck />
//           {!collapsed && ' Leave Management'} {/* Display text only if not collapsed */}
//         </Nav.Link>
//         <Nav.Link href="/doctor-settings" className="sidebar-item">
//           <FaCog />
//           {!collapsed && ' Settings'}
//         </Nav.Link>

//         {/* Leave Management (Apply Leave) Option */}
       
//       </Nav>
//     </div>
//   );
// };

// export default Sidebar;


import React, { useState } from 'react';
import { Nav, Button } from 'react-bootstrap';
import { FaCalendar, FaList, FaEnvelope, FaCog, FaBars, FaCalendarCheck } from 'react-icons/fa'; // FaCalendarCheck added for leave icon
import './Doctorsidebar.css'; // Custom styling

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true); // Initial state is collapsed

  // Toggle sidebar between collapsed and expanded
  const handleToggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : 'expanded'}`}>
      <div className="sidebar-header">
        <h3 className="sidebar-title">{collapsed ? '' : "Doctor's Panel"}</h3>
      </div>

      <Nav className="flex-column">
        <Nav.Link href="/doctordashboard" className="sidebar-item">
          <FaCalendar />
          {!collapsed && ' Dashboard'}
        </Nav.Link>
        <Nav.Link href="/appointments" className="sidebar-item">
          <FaList />
          {!collapsed && ' Appointments'}
        </Nav.Link>
        <Nav.Link href="/patients" className="sidebar-item">
          <FaList />
          {!collapsed && ' Patient List'}
        </Nav.Link>
        <Nav.Link href="/messages" className="sidebar-item">
          <FaEnvelope />
          {!collapsed && ' Messages'}
        </Nav.Link>
        <Nav.Link href="/leave" className="sidebar-item">
          <FaCalendarCheck />
          {!collapsed && ' Leave Management'} {/* Display text only if not collapsed */}
        </Nav.Link>
        <Nav.Link href="/doctor-settings" className="sidebar-item">
          <FaCog />
          {!collapsed && ' Settings'}
        </Nav.Link>
      </Nav>

      {/* Toggle button at the bottom */}
      <Button variant="link" onClick={handleToggle} className="toggle-button-doctor">
        <FaBars />
      </Button>
    </div>
  );
};

export default Sidebar;
