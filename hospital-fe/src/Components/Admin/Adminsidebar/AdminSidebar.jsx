// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Nav, NavItem } from 'react-bootstrap';
// import { FaTachometerAlt, FaUserMd, FaUserInjured, FaCalendarAlt, FaMoneyBillWave, FaCogs, FaSignOutAlt, FaBars, FaArrowLeft } from 'react-icons/fa';
// import './AdminSidebar.css';

// const Sidebar = () => {
//   const [collapsed, setCollapsed] = useState(true);  // Initially collapsed state

//   const toggleSidebar = () => {
//     setCollapsed(!collapsed);  // Toggle sidebar collapse/expand
//   };

//   return (
//     <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
//       {/* Sidebar Toggle Button for Sidebar */}
//       <div className="toggle-btn" onClick={toggleSidebar}>
//         {collapsed ? <FaBars /> : <FaArrowLeft />}
//       </div>

//       {/* Sidebar Content */}
//       <div className="sidebar-header">
//         {/* You can add any header content here */}
//       </div>
//       <Nav className="flex-column">
//         <NavItem>
//           <Link to="/" className="nav-link">
//             <FaTachometerAlt />
//             {!collapsed && <span>Dashboard</span>}
//           </Link>
//         </NavItem>
//         <NavItem>
//           <Link to="/manage-doctors" className="nav-link">
//             <FaUserMd />
//             {!collapsed && <span>Manage Doctors</span>}
//           </Link>
//         </NavItem>
//         <NavItem>
//           <Link to="/manage-patients" className="nav-link">
//             <FaUserInjured />
//             {!collapsed && <span>Manage Patients</span>}
//           </Link>
//         </NavItem>
//         <NavItem>
//           <Link to="/appointments" className="nav-link">
//             <FaCalendarAlt />
//             {!collapsed && <span>Appointment Management</span>}
//           </Link>
//         </NavItem>
//         <NavItem>
//           <Link to="/billing" className="nav-link">
//             <FaMoneyBillWave />
//             {!collapsed && <span>Billing & Payments</span>}
//           </Link>
//         </NavItem>
//         <NavItem>
//           <Link to="/inventory" className="nav-link">
//             <FaCogs />
//             {!collapsed && <span>Inventory Management</span>}
//           </Link>
//         </NavItem>
//         <NavItem>
//           <Link to="/reports" className="nav-link">
//             <FaCogs />
//             {!collapsed && <span>Reports</span>}
//           </Link>
//         </NavItem>
//         <NavItem>
//           <Link to="/settings" className="nav-link">
//             <FaCogs />
//             {!collapsed && <span>Settings</span>}
//           </Link>
//         </NavItem>
//         <NavItem>
//           <Link to="/logout" className="nav-link">
//             <FaSignOutAlt />
//             {!collapsed && <span>Logout</span>}
//           </Link>
//         </NavItem>
//       </Nav>
//     </div>
//   );
// };

// export default Sidebar;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Nav, NavItem } from 'react-bootstrap';
import { FaTachometerAlt, FaUserMd, FaUserInjured, FaCalendarAlt, FaMoneyBillWave, FaCogs, FaSignOutAlt, FaBars, FaArrowLeft } from 'react-icons/fa';
import './AdminSidebar.css';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);  // Initially collapsed state

  const toggleSidebar = () => {
    setCollapsed(!collapsed);  // Toggle sidebar collapse/expand
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Toggle Button for Sidebar */}
      <div className="toggle-btn" onClick={toggleSidebar}>
        {collapsed ? <FaBars /> : <FaArrowLeft />}
      </div>

      {/* Sidebar Content */}
      <div className="sidebar-header">
        {/* You can add any header content here */}
      </div>
      <Nav className="flex-column">
        <NavItem>
          <Link to="/" className="nav-link">
            <FaTachometerAlt />
            {!collapsed && <span>Dashboard</span>}
          </Link>
        </NavItem>
        <NavItem>
          <Link to="/manage-doctors" className="nav-link">
            <FaUserMd />
            {!collapsed && <span>Manage Doctors</span>}
          </Link>
        </NavItem>
        <NavItem>
          <Link to="/manage-patients" className="nav-link">
            <FaUserInjured />
            {!collapsed && <span>Manage Patients</span>}
          </Link>
        </NavItem>
        <NavItem>
          <Link to="/appointments" className="nav-link">
            <FaCalendarAlt />
            {!collapsed && <span>Appointment Management</span>}
          </Link>
        </NavItem>
        <NavItem>
          <Link to="/billing" className="nav-link">
            <FaMoneyBillWave />
            {!collapsed && <span>Billing & Payments</span>}
          </Link>
        </NavItem>
        <NavItem>
          <Link to="/inventory" className="nav-link">
            <FaCogs />
            {!collapsed && <span>Inventory Management</span>}
          </Link>
        </NavItem>
        <NavItem>
          <Link to="/reports" className="nav-link">
            <FaCogs />
            {!collapsed && <span>Reports</span>}
          </Link>
        </NavItem>
        <NavItem>
          <Link to="/settings" className="nav-link">
            <FaCogs />
            {!collapsed && <span>Settings</span>}
          </Link>
        </NavItem>
        <NavItem>
          <Link to="/logout" className="nav-link">
            <FaSignOutAlt />
            {!collapsed && <span>Logout</span>}
          </Link>
        </NavItem>
      </Nav>
    </div>
  );
};

export default Sidebar;
