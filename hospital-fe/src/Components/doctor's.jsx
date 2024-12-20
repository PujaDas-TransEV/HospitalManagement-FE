import React from "react";

const DoctorsPage = () => {
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
            <div className="res-container">
              <button
                type="button"
                className="navbar-toggle"
                data-toggle="collapse"
                data-target=".navbar-responsive-collapse"
              >
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
                    <a href="appointment.html">BOOK APPOINTMENT</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image title */}
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>DOCTORS</h2>
      </div>

      {/* Doctors Team */}
      <div className="container content-md team-v1">
        <ul className="list-unstyled row">
          <li className="col-sm-3 col-xs-6" style={{ marginBottom: "30px" }}>
            <div className="team-img">
              <img className="img-responsive" src="assets/img/team/1.jpg" alt="" />
              <ul>
                <li>
                  <a href="https://www.twitter.com">
                    <i className="icon-custom icon-sm rounded-x fa fa-twitter"></i>
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com">
                    <i className="icon-custom icon-sm rounded-x fa fa-facebook"></i>
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com">
                    <i className="icon-custom icon-sm rounded-x fa fa-instagram"></i>
                  </a>
                </li>
              </ul>
            </div>
            <h3>Dr. Jamshid</h3>
            <h4>/ Consultant</h4>
            <p>Child care</p>
          </li>
          <li className="col-sm-3 col-xs-6" style={{ marginBottom: "30px" }}>
            <div className="team-img">
              <img className="img-responsive" src="assets/img/team/2.jpg" alt="" />
              <ul>
                <li>
                  <a href="https://www.twitter.com">
                    <i className="icon-custom icon-sm rounded-x fa fa-twitter"></i>
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com">
                    <i className="icon-custom icon-sm rounded-x fa fa-facebook"></i>
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com">
                    <i className="icon-custom icon-sm rounded-x fa fa-instagram"></i>
                  </a>
                </li>
              </ul>
            </div>
            <h3>Dr. Sahail</h3>
            <h4>/ MBBS</h4>
            <p>Neurology</p>
          </li>
          <li className="col-sm-3 col-xs-6">
            <div className="team-img">
              <img className="img-responsive" src="assets/img/team/3.jpg" alt="" />
              <ul>
                <li>
                  <a href="https://www.twitter.com">
                    <i className="icon-custom icon-sm rounded-x fa fa-twitter"></i>
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com">
                    <i className="icon-custom icon-sm rounded-x fa fa-facebook"></i>
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com">
                    <i className="icon-custom icon-sm rounded-x fa fa-instagram"></i>
                  </a>
                </li>
              </ul>
            </div>
            <h3>Dr. Shahab Shah</h3>
            <h4>/ MBBS, MS, DNB</h4>
            <p>General Surgery</p>
          </li>

          <li className="col-sm-3 col-xs-6">
            <div className="team-img">
              <img className="img-responsive" src="assets/img/team/4.jpg" alt="" />
              <ul>
                <li>
                  <a href="https://www.twitter.com">
                    <i className="icon-custom icon-sm rounded-x fa fa-twitter"></i>
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com">
                    <i className="icon-custom icon-sm rounded-x fa fa-facebook"></i>
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com">
                    <i className="icon-custom icon-sm rounded-x fa fa-instagram"></i>
                  </a>
                </li>
              </ul>
            </div>
            <h3>Dr. Wasim</h3>
            <h4>/ MBBS</h4>
            <p>Health Checkup</p>
          </li>
        </ul>

        {/* Second Line */}
        <div className="container content-md team-v1" style={{ marginLeft: "-13px" }}>
          <ul className="list-unstyled row">
            <li className="col-sm-3 col-xs-6" style={{ marginBottom: "30px" }}>
              <div className="team-img">
                <img className="img-responsive" src="assets/img/team/5.jpg" alt="" />
                <ul>
                  <li>
                    <a href="https://www.twitter.com">
                      <i className="icon-custom icon-sm rounded-x fa fa-twitter"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.facebook.com">
                      <i className="icon-custom icon-sm rounded-x fa fa-facebook"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.instagram.com">
                      <i className="icon-custom icon-sm rounded-x fa fa-instagram"></i>
                    </a>
                  </li>
                </ul>
              </div>
              <h3>Dr. Malik</h3>
              <h4>/ MD</h4>
              <p>Dermatology</p>
            </li>
            <li className="col-sm-3 col-xs-6" style={{ marginBottom: "30px" }}>
              <div className="team-img">
                <img className="img-responsive" src="assets/img/team/6.jpg" alt="" />
                <ul>
                  <li>
                    <a href="https://www.twitter.com">
                      <i className="icon-custom icon-sm rounded-x fa fa-twitter"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.facebook.com">
                      <i className="icon-custom icon-sm rounded-x fa fa-facebook"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.instagram.com">
                      <i className="icon-custom icon-sm rounded-x fa fa-instagram"></i>
                    </a>
                  </li>
                </ul>
              </div>
              <h3>Dr. Haider</h3>
              <h4>/ MBBS, MS, MD</h4>
              <p>Eye Specialist</p>
            </li>
            <li className="col-sm-3 col-xs-6">
              <div className="team-img">
                <img className="img-responsive" src="assets/img/team/7.jpg" alt="" />
                <ul>
                  <li>
                    <a href="https://www.twitter.com">
                      <i className="icon-custom icon-sm rounded-x fa fa-twitter"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.facebook.com">
                      <i className="icon-custom icon-sm rounded-x fa fa-facebook"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.instagram.com">
                      <i className="icon-custom icon-sm rounded-x fa fa-instagram"></i>
                    </a>
                  </li>
                </ul>
              </div>
              <h3>Dr. Jamal</h3>
              <h4>/ MBBS</h4>
              <p>CCU & ICU</p>
            </li>

            <li className="col-sm-3 col-xs-6" style={{ marginBottom: "30px" }}>
              <div className="team-img">
                <img className="img-responsive" src="assets/img/team/8.jpg" alt="" />
                <ul>
                  <li>
                    <a href="https://www.twitter.com">
                      <i className="icon-custom icon-sm rounded-x fa fa-twitter"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.facebook.com">
                      <i className="icon-custom icon-sm rounded-x fa fa-facebook"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.instagram.com">
                      <i className="icon-custom icon-sm rounded-x fa fa-instagram"></i>
                    </a>
                  </li>
                </ul>
              </div>
              <h3>Dr. Usman</h3>
              <h4>/ MBBS</h4>
              <p>Health Checkup</p>
            </li>
          </ul>
        </div>
      </div>
      {/* Footer */}
      <div className="footer-v1" style={{ marginTop: "-100px" }}>
        <div className="footer">
          <div className="container">
            <div className="row">
              {/* About */}
              <div className="col-md-3" style={{ marginBottom: "40px" }}>
                <a href="index.html">
                  <img
                    id="logo-footer"
                    className="footer-logo"
                    src="assets/img/logo/unity_white.jpg"
                    alt=""
                  />
                </a>
                <p>
                  At Unity Hospital, we are convinced that 'quality' and 'lowest cost' are not mutually exclusive when it comes to healthcare delivery.
                </p>
                <p>
                  Our mission is to deliver high quality, affordable healthcare services to the broader population in India.
                </p>
              </div>
              {/* Latest Posts */}
              <div className="col-md-3" style={{ marginBottom: "40px" }}>
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
              {/* Contact */}
              <div className="col-md-3" style={{ marginBottom: "40px" }}>
                <div className="headline">
                  <h2>Contact Info</h2>
                </div>
                <ul className="list-unstyled contact-info">
                  <li>
                    <i className="fa fa-home"></i> A Block 16, Lahore, Pakistan
                  </li>
                  <li>
                    <i className="fa fa-phone"></i> 0332-4232444
                  </li>
                  <li>
                    <i className="fa fa-envelope"></i> MajidKhan6845@gmail.com
                  </li>
                  <li>
                    <i className="fa fa-globe"></i> unityhospital.com
                  </li>
                </ul>
              </div>
              {/* Working Hours */}
              <div className="col-md-3" style={{ marginBottom: "40px" }}>
                <div className="headline">
                  <h2>Working Hours</h2>
                </div>
                <ul className="list-unstyled working-hours">
                  <li>
                    <strong>Monday-Friday</strong>
                    <span>8:00 AM - 6:00 PM</span>
                  </li>
                  <li>
                    <strong>Saturday</strong>
                    <span>8:00 AM - 2:00 PM</span>
                  </li>
                  <li>
                    <strong>Sunday</strong>
                    <span>Closed</span>
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

export default DoctorsPage;
