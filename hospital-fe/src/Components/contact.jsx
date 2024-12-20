import React, { useState } from 'react';

const ContactPage = () => {
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowSuccessMsg(true);
  };

  return (
    <div className="wrapper">
      {/* === Header v1 === */}
      <div className="header-v1">
        {/* Topbar */}
        <div className="topbar-v1">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <ul className="list-inline top-v1-contacts">
                  <li>
                    <i className="fa fa-envelope"></i> Email: MajidKhan6845@gmail.com
                  </li>
                  <li>
                    <i className="fa fa-phone"></i> Contact no : 0332-4232444
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* End Topbar */}

        {/* Navbar */}
        <div className="navbar mega-menu" role="navigation">
          <div className="container">
            <div className="res-container">
              <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-responsive-collapse">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>

              <div className="navbar-brand">
                <a href="index.html">
                  <img src="assets/img/logo/unity_white.jpg" alt="Logo" />
                </a>
              </div>
            </div>

            <div className="collapse navbar-collapse navbar-responsive-collapse">
              <div className="res-container">
                <ul className="nav navbar-nav">
                  <li className="mega-menu-fullwidth"><a href="index.html">HOME</a></li>
                  <li className="mega-menu-fullwidth"><a href="about.html">ABOUT US</a></li>
                  <li className="mega-menu-fullwidth"><a href="doctors.html">DOCTORS</a></li>
                  <li className="mega-menu-fullwidth"><a href="gallery.html">GALLERY</a></li>
                  <li className="mega-menu-fullwidth"><a href="blog.html">BLOGS</a></li>
                  <li className="mega-menu-fullwidth"><a href="contact.html">CONTACT US</a></li>
                  <li className="mega-menu-fullwidth"><a href="registration.html">REGISTRATION</a></li>
                  <li className="mega-menu-fullwidth"><a href="login.html">LOGIN</a></li>
                  <li className="mega-menu-fullwidth"><a href="appointment.html">BOOK APPOINTMENT</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* End Navbar */}

        {/* === Content Part === */}
        <div className="container content">
          <div className="row" style={{ marginBottom: '30px' }}>
            <div className="col-md-9" style={{ marginBottom: '30px' }}>
              <div className="headline"><h2>Contact Form</h2></div>

              <form onSubmit={handleSubmit} className="sky-form sky-changes-3">
                <fieldset>
                  <div className="row">
                    <section className="col col-6">
                      <label className="label">Name</label>
                      <label className="input">
                        <i className="icon-append fa fa-user"></i>
                        <input type="text" name="name" id="name" required />
                      </label>
                    </section>
                    <section className="col col-6">
                      <label className="label">E-mail</label>
                      <label className="input">
                        <i className="icon-append fa fa-envelope-o"></i>
                        <input type="email" name="email" id="email" required />
                      </label>
                    </section>
                  </div>

                  <section>
                    <label className="label">Subject</label>
                    <label className="input">
                      <i className="icon-append fa fa-tag"></i>
                      <input type="text" name="subject" id="subject" required />
                    </label>
                  </section>

                  <section>
                    <label className="label">Mobile Number</label>
                    <label className="input">
                      <i className="icon-append fa fa-phone"></i>
                      <input type="text" name="number" id="number" required />
                    </label>
                  </section>

                  <section>
                    <label className="label">Message</label>
                    <label className="textarea">
                      <i className="icon-append fa fa-comment"></i>
                      <textarea rows="4" name="message" id="message" required></textarea>
                    </label>
                  </section>
                </fieldset>

                {showSuccessMsg && (
                  <div className="alert alert-success successBox" style={{ width: '90%', marginLeft: '30px' }}>
                    <button type="button" className="close" onClick={() => setShowSuccessMsg(false)}>×</button>
                    <strong style={{ fontSize: '16px' }}>Congratulations!</strong><span className="alert-link"> Your Message Has been sent!</span>
                  </div>
                )}

                <footer>
                  <button type="submit" className="btn-u">Send message</button>
                </footer>
              </form>
            </div>

            <div className="col-md-3" style={{ marginTop: '56px' }}>
              {/* Address */}
              <div className="headline"><h2>Address</h2></div>
              <ul className="list-unstyled who" style={{ marginBottom: '30px' }}>
                <li><a href="#"><i className="fa fa-home"></i>Satellite Town, Rawalpindi</a></li>
                <li><a href="#"><i className="fa fa-envelope"></i>unityHospital23@gmail.com</a></li>
                <li><a href="#"><i className="fa fa-phone"></i>03324232444</a></li>
                <li><a href="#"><i className="fa fa-globe"></i>http://www.UnityHospital.com</a></li>
              </ul>

              {/* Business Hours */}
              <div className="headline"><h2>Business Hours</h2></div>
              <ul className="list-unstyled" style={{ marginBottom: '30px' }}>
                <li><strong>Monday-Saturday:</strong> 24/7 Available.</li>
                <li><strong>Sunday:</strong> 4 AM to 11 PM.</li>
              </ul>

              {/* Why Choose Us? */}
              <div className="headline"><h2>Why Choose Us?</h2></div>
              <p>All healthcare facilities can be accessed here under one roof, making UNITY Hospital a one point contact for all your healthcare needs.</p>
              <ul className="list-unstyled">
                <li><i className="fa fa-check color-green"></i> 24/7 Ambulance Support.</li>
                <li><i className="fa fa-check color-green"></i> Eminent and Experienced Doctors.</li>
                <li><i className="fa fa-check color-green"></i> Multiple Options For Treatment.</li>
              </ul>
            </div>
          </div>
        </div>
        {/* === Footer === */}
        <div className="footer-v1">
          <div className="footer">
            <div className="container">
              <div className="row">
                {/* About */}
                <div className="col-md-3" style={{ marginBottom: '40px' }}>
                  <a href="index.html"><img id="logo-footer" className="footer-logo" src="assets/img/logo/unity_white.jpg" alt="" /></a>
                  <p>At Unity Hospital, we are convinced that 'quality' and 'lowest cost' are not mutually exclusive when it comes to healthcare delivery.</p>
                  <p>Our mission is to deliver high quality, affordable healthcare services to the broader population in India.</p>
                </div>
                {/* End About */}

                {/* Latest */}
                <div className="col-md-3" style={{ marginBottom: '40px' }}>
                  <div className="posts">
                    <div className="headline"><h2>Latest Posts</h2></div>
                    <ul className="list-unstyled latest-list">
                      <li><a href="blog.html">Incredible content</a><small>December 16, 2020</small></li>
                      <li><a href="gallery.html">Latest Images</a><small>December 16, 2020</small></li>
                      <li><a href="terms.html">Terms and Conditions</a><small>December 16, 2020</small></li>
                    </ul>
                  </div>
                </div>
                {/* End Latest */}

                {/* Link List */}
                <div className="col-md-3" style={{ marginBottom: '40px' }}>
                  <div className="headline"><h2>Useful Links</h2></div>
                  <ul className="list-unstyled link-list">
                    <li><a href="about.html">About us</a><i className="fa fa-angle-right"></i></li>
                    <li><a href="Contact.html">Contact us</a><i className="fa fa-angle-right"></i></li>
                    <li><a href="appointment.html">Book Appointment</a><i className="fa fa-angle-right"></i></li>
                  </ul>
                </div>
                {/* End Link List */}

                {/* Address */}
                <div className="col-md-3 map-img" style={{ marginBottom: '40px' }}>
                  <div className="headline"><h2>Contact Us</h2></div>
                  <address>
                    Unity Hospital <br />
                    Satellite Town, Rawalpindi<br />
                    Phone: 03324232444 <br />
                    Email: unityHospital23@gmail.com 
                  </address>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
