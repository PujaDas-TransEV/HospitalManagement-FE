import React from 'react';

const About = () => {
  return (
    <div className="wrapper">
      {/* Header */}
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
        {/* Navbar */}
        <div className="navbar mega-menu" role="navigation">
          <div className="container">
            {/* Brand and toggle get grouped for better mobile display */}
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

            {/* Navbar Links */}
            <div className="collapse navbar-collapse navbar-responsive-collapse">
              <div className="res-container">
                <ul className="nav navbar-nav">
                  <li className="mega-menu-fullwidth">
                    <a href="index.html">HOME</a>
                  </li>
                  <li className="mega-menu-fullwidth">
                    <a href="about.html">ABOUT US</a>
                  </li>
                  <li className="mega-menu-fullwidth">
                    <a href="doctors.html">DOCTORS</a>
                  </li>
                  <li className="mega-menu-fullwidth">
                    <a href="gallery.html">GALLERY</a>
                  </li>
                  <li className="mega-menu-fullwidth">
                    <a href="blog.html">BLOGS</a>
                  </li>
                  <li className="mega-menu-fullwidth">
                    <a href="contact.html">CONTACT US</a>
                  </li>
                  <li className="mega-menu-fullwidth">
                    <a href="registration.html">REGISTRATION</a>
                  </li>
                  <li className="mega-menu-fullwidth">
                    <a href="login.html">LOGIN</a>
                  </li>
                  <li className="mega-menu-fullwidth">
                    <a href="appointment.jsx">BOOK APPOINTMENT</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* End Navbar */}
      </div>

      {/* About Section */}
      <div className="container content-sm" style={{ marginTop: '-25px' }}>
        <div className="headline-center" style={{ marginBottom: '60px' }}>
          <h2>
            ABOUT<span style={{ color: '#72c02c' }}> UNITY </span>
          </h2>
        </div>
      </div>

      {/* About Section 1 */}
      <div className="container content" style={{ marginTop: '-90px' }}>
        <div className="row" style={{ marginBottom: '40px' }}>
          <div className="col-md-6" style={{ marginBottom: '40px' }}>
            <p>
              <span style={{ color: '#72c02c' }}>UNITY </span> Hospital is a multi/super speciality hospital located at the prime location of Vaishnodevi Circle, SG Road, Ahmedabad; with state-of-the-art facilities & treatments at an affordable cost, encompassing wide spectrum of accurate diagnostics and elegant therapeutics created on the philosophical edifice of patient and ethical centricity ensuring humanistic dispensation.
            </p>
            <ul className="list-unstyled">
              <li><i className="fa fa-check color-green"></i> Multiple Options For Treatment.</li>
              <li><i className="fa fa-check color-green"></i> Full Of Latest Technologies and Equipments.</li>
              <li><i className="fa fa-check color-green"></i> Best Hospital Of 2020 Award Winner.</li>
              <li><i className="fa fa-check color-green"></i> 24/7 Ambulance Support.</li>
              <li><i className="fa fa-check color-green"></i> Eminent and Experienced Doctors.</li>
            </ul>
            <blockquote>
              <p>As a leading health organization in our region, we want to be a strong influence for better health and prevention, and there’s no better place to start than among our own employees.</p>
              <small>CEO Harshil Patel</small>
            </blockquote>
          </div>

          <div className="col-md-6" style={{ marginBottom: '40px' }}>
            <div className="responsive-video">
              <iframe src="https://player.vimeo.com/video/33787650" allowFullScreen></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* About Section 2 */}
      <div className="container content-sm aboutSection">
        <div className="row service-block-v6 section1">
          <div className="col-md-4" style={{ marginBottom: '50px' }}>
            <i className="icon-custom rounded-x icon-color-u icon-line icon-medical-054"></i>
            <div className="service-desc">
              <h2>Vision</h2>
              <p>Ensuring ‘well being’ as a humane commitment to enliven humanity.</p>
            </div>
          </div>
          <div className="col-md-4" style={{ marginBottom: '50px' }}>
            <i className="icon-custom rounded-x icon-color-u icon-line icon-medical-038"></i>
            <div className="service-desc">
              <h2>Mission</h2>
              <p>The ‘well being’ ensured by extension of Available, Accessible, Affordable, Safe, Efficacious, Professional and Ethical.</p>
            </div>
          </div>
          <div className="col-md-4">
            <i className="icon-custom rounded-x icon-color-u icon-line icon-medical-004"></i>
            <div className="service-desc">
              <h2>Core Values</h2>
              <p>Team Work, Integrity, Responsibility, Compassion, and Ethics.</p>
            </div>
          </div>
        </div>
      </div>

      {/* About Section 3 */}
      <div className="bg-color-light">
        <div className="container content-sm">
          <div className="headline-center" style={{ marginBottom: '60px' }}>
            <h2>OUR DEPARTMENTS</h2>
            <div className="line"></div>
            <p>UNITY Hospital is spread over a massive 6-acre campus providing <strong> 300+ </strong> beds and catering for nearly 45 super-specialties.</p>
          </div>

          {/* Departments */}
          <div className="row" style={{ marginBottom: '30px' }}>
            <div className="col-sm-6" style={{ marginBottom: '50px' }}>
              <div className="service-block-v8">
                <i className="icon-medical-008"></i>
                <div className="service-block-desc">
                  <h3>Cardiology</h3>
                  <p>The department of cardiology at UNITY Hospital comprises of top cardiac experts who have appreciable experience in dealing with various types of cases in the cardiology and perform accurate diagnosis.</p>
                </div>
              </div>
            </div>
            <div className="col-sm-6" style={{ marginBottom: '20px' }}>
              <div className="service-block-v8">
                <i className="icon-medical-094"></i>
                <div className="service-block-desc">
                  <h3>Dermatology and Cosmetology</h3>
                  <p>The dermatology department of UNITY Hospital consists of a team of dermatologists and staff who are practicing in the field of dermatology and cosmetology for years and perform their best to treat the patients.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="row" style={{ marginBottom: '30px' }}>
            <div className="col-sm-6" style={{ marginBottom: '50px' }}>
              <div className="service-block-v8">
                <i className="icon-medical-005"></i>
                <div className="service-block-desc">
                  <h3>Emergency Care, CCU, & ICU</h3>
                  <p>At UNITY Hospital, 24x7 care is provided to all our patients, keeping in mind patient dignity and ethical practice. Holistic care is ensured by our team of critical care experts who use a multidisciplinary approach.</p>
                </div>
              </div>
            </div>
            <div className="col-sm-6" style={{ marginBottom: '20px' }}>
              <div className="service-block-v8">
                <i className="icon-medical-037"></i>
                <div className="service-block-desc">
                  <h3>General Surgery</h3>
                  <p>At UNITY Hospital, we have a team of experienced general surgeons who possess the skills to carry out the most complex surgeries.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row" style={{ marginBottom: '20px' }}>
            <div className="col-sm-6" style={{ marginBottom: '50px' }}>
              <div className="service-block-v8">
                <i className="icon-medical-001"></i>
                <div className="service-block-desc">
                  <h3>Health Checkup Packages</h3>
                  <p>UNITY Hospital provides health check up packages in Ahmedabad at very affordable price. As we aim at imbibing hope, health, and happiness in the community at large, our health check up packages in Ahmedabad help in early diagnosis.</p>
                </div>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="service-block-v8">
                <i className="icon-medical-044"></i>
                <div className="service-block-desc">
                  <h3>Neurology</h3>
                  <p>The team at the Neurology department of UNITY Hospital comprises of highly-trained, skilled, and well-experienced team of Neurologists, Neurosurgeons, interventional radiologists, Neurophysiotherapists, and rehabilitation teams who make sure that the patients receive the best quality treatments.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer-v1">
        <div className="footer">
          <div className="container">
            <div className="row">
              {/* About */}
              <div className="col-md-3" style={{ marginBottom: '40px' }}>
                <a href="index.html">
                  <img id="logo-footer" className="footer-logo" src="assets/img/logo/unity_white.jpg" alt="" />
                </a>
                <p>At Unity Hospital, we are convinced that 'quality' and 'lowest cost' are not mutually exclusive when it comes to healthcare delivery.</p>
                <p>Our mission is to deliver high quality, affordable healthcare services to the broader population in India.</p>
              </div>

              {/* Latest Posts */}
              <div className="col-md-3" style={{ marginBottom: '40px' }}>
                <div className="posts">
                  <div className="headline">
                    <h2>Latest Posts</h2>
                  </div>
                  <ul className="list-unstyled latest-list">
                    <li>
                      <a href="blog.html">Incredible content</a>
                      <small>December 16, 2020</small>
                    </li>
                    <li>
                      <a href="gallery.html">Latest Images</a>
                      <small>December 16, 2020</small>
                    </li>
                    <li>
                      <a href="terms.html">Terms and Conditions</a>
                      <small>December 16, 2020</small>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Contact Info */}
              <div className="col-md-3" style={{ marginBottom: '40px' }}>
                <h3 className="block-title">Contact Info</h3>
                <ul className="list-unstyled address-list">
                  <li>
                    <i className="fa fa-map-marker"></i> Location: SG Highway, Ahmedabad
                  </li>
                  <li>
                    <i className="fa fa-envelope"></i> Email: <a href="mailto:MajidKhan6845@gmail.com">MajidKhan6845@gmail.com</a>
                  </li>
                  <li>
                    <i className="fa fa-phone"></i> Phone: +91 0332-4232444
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
