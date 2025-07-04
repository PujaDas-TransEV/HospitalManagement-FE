
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <div className="footer">
      {/* Contact Info */}
     

      {/* Quick Navigation */}
      <div className="text">
        <h3 style={{ color: 'white' }}>Navigation</h3>
        <p><Link to="/about" style={{ color: 'whitesmoke', textDecoration: 'none' }}>About</Link></p>
        <p><Link to="/medical" style={{ color: 'whitesmoke', textDecoration: 'none' }}>Medical Care</Link></p>
        <p><Link to="/about" style={{ color: 'whitesmoke', textDecoration: 'none' }}>Doctors</Link></p>
        <p><Link to="/contact" style={{ color: 'whitesmoke', textDecoration: 'none' }}>Contact</Link></p>
      </div>
 <div className="text">
        <h3 style={{ color: 'white' }}>Contact Us</h3>
        <p style={{ color: 'whitesmoke' }}>Phone: +91 79080 03488</p>
        <p style={{ color: 'whitesmoke' }}>Email: lifecare@hospital.com</p>
        <p style={{ color: 'whitesmoke' }}>Location: Newtown, Kolkata - 700156</p>
      </div>
      {/* Newsletter */}
      <div className="text">
        <h3 style={{ color: 'white' }}>Newsletter</h3>
        <p style={{ color: 'whitesmoke' }}>Stay updated with health tips and hospital news.</p>
        <form>
        
          <input
  type="email"
  placeholder="Enter your email"
  // style={{
  //   padding: '10px 15px',
  //   width: '220px',
  //   borderRadius: '30px',
  //   border: '2px solid #00b894',
  //   outline: 'none',
  //   transition: '0.3s',
  // }}
  onFocus={(e) => e.target.style.borderColor = '#0984e3'}
  onBlur={(e) => e.target.style.borderColor = '#00b894'}
/>

          <button
            type="submit"
            style={{
              padding: '8px 12px',
              borderRadius: '5px',
              border: 'none',
              backgroundColor: '#00b894',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Subscribe
          </button>
        </form>
      </div>

      {/* Social Media */}
      <div className="text">
        <h3 style={{ color: 'white' }}>Follow Us</h3>
        <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" style={{ color: 'whitesmoke', fontSize: '20px' }}>
            <FaFacebookF />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" style={{ color: 'whitesmoke', fontSize: '20px' }}>
            <FaTwitter />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ color: 'whitesmoke', fontSize: '20px' }}>
            <FaInstagram />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ color: 'whitesmoke', fontSize: '20px' }}>
            <FaLinkedinIn />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
