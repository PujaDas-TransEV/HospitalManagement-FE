import React from 'react';

const PrivacyPolicy = () => {
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
        {/* End Navbar */}

        {/* Privacy Policy Header */}
        <div className="container" style={{ marginTop: '50px' }}>
          <div className="headline-center" style={{ marginBottom: '60px' }}>
            <h2>PRIVACY POLICY</h2>
            <div className="line"></div>
          </div>
        </div>
      </div>

      {/* Privacy Policy Content */}
      <div className="container content">
        <div className="row-fluid privacy">
          <h4 style={{ marginTop: '-30px' }}>DESCRIPTION</h4>
          <p>UNITY Hospitals are required by law to maintain the privacy of your medical information, to provide you with this written Notice of Privacy Rights and Practices, and to abide by the terms of the Notice currently in effect. This policy shall be applicable to the information collected or displayed on our website. We assure to take the privacy seriously and to keep your privacy and confidentiality of the information provided to us.</p>
          <p> We shall not intentionally or unless required under laws share the contents of any person with any outside authorities or any third party. We do not guarantee or assure that the electronic communications received from you or contents or records may not be accessible to the third parties.</p><br/>

          <h4>COMMUNICATION</h4>
          <p>UNITY Hospitals may reach out to you via various means of communication including but not limited to phone, SMS, online messengers (including Facebook Messenger, Whatsapp etc), and emails to update you with your (or your families) appointments, medical history, doctor requests, updates at UNITY Hospitals and its other properties operated by Mandke Foundation. If you do not wish to receive such communications, you can either communicate the same to the caller, use the unsubscribe link on the bottom of the emails, or send a request to Unityhospital@gmail.com and the same will be acted upon within 2 weeks.</p><br/>

          <h4>CHANGES IN THE PRIVACY POLICY</h4>
          <p>We reserve the right to amend our privacy / security policy and make the new provisions effective for all information we maintain from time to time. The revised policy will be posted in our facilities and offices, and will be available while obtaining the treatment from our hospital directly. Your use of our website shall comprise of acceptance of any changes of this Privacy and Security Policy.</p><br/>

          <h4>OTHER WEBSITES</h4>
          <p>We do not extend the security and privacy policy to any other websites except for this website. We do not make any warranty or give any security to the personal information disclosed by you to the other websites, even if such websites are linked to our website or they are using our website link.</p><br/>

          <h4>LAW AND JURISDICTION</h4>
          <p>The information provided under this website and the terms and conditions therein are governed by and to be interpreted in accordance with Laws of India. Any dispute arising out of the use of this website whether in contract or tort or otherwise, shall be submitted to the jurisdiction of the courts in Mumbai, India for its resolution.</p><br/>
        </div>
      </div>

      {/* Footer */}
      <div className="footer-v1">
        <div className="footer">
          <div className="container">
            <div className="row">
              <div className="col-md-3" style={{ marginBottom: '40px' }}>
                <a href="index.html"><img id="logo-footer" className="footer-logo" src="assets/img/logo/unity_white.jpg" alt="Logo" /></a>
                <p>At Unity Hospital, we are convinced that 'quality' and 'lowest cost' are not mutually exclusive when it comes to healthcare delivery.</p>
                <p>Our mission is to deliver high quality, affordable healthcare services to the broader population in India.</p>
              </div>

              <div className="col-md-3" style={{ marginBottom: '40px' }}>
                <div className="posts">
                  <div className="headline"><h2>Latest Posts</h2></div>
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

              <div className="col-md-3" style={{ marginBottom: '40px' }}>
                <div className="headline"><h2>Useful Links</h2></div>
                <ul className="list-unstyled link-list">
                  <li><a href="about.html">About us</a><i className="fa fa-angle-right"></i></li>
                  <li><a href="Contact.html">Contact us</a><i className="fa fa-angle-right"></i></li>
                  <li><a href="appointment.html">Book Appointment</a><i className="fa fa-angle-right"></i></li>
                </ul>
              </div>

              <div className="col-md-3 map-img" style={{ marginBottom: '40px' }}>
                <div className="headline"><h2>Contact Us</h2></div>
                <address style={{ marginBottom: '40px' }}>
                  Unity Hospital <br />
                  Ahmedabad, IN <br />
                  Phone: 886 666 00555 <br />
                  Email: unityhospital@gmail.com
                </address>
              </div>
            </div>
          </div>
        </div>

        <div className="copyright">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <p>
                  2020 &copy; All Rights Reserved.
                  <a href="privacy.html">Privacy Policy</a> | <a href="terms.html">Terms of Service</a>
                </p>
              </div>
              <div className="col-md-6">
                <ul className="footer-socials list-inline">
                  <li>
                    <a href="http://www.facebook.com" className="tooltips" data-toggle="tooltip" data-placement="top" title="Facebook">
                      <i className="fa fa-facebook"></i>
                    </a>
                  </li>
                  <li>
                    <a href="http://www.skype.com" className="tooltips" data-toggle="tooltip" data-placement="top" title="Skype">
                      <i className="fa fa-skype"></i>
                    </a>
                  </li>
                  <li>
                    <a href="http://www.googleplus.com" className="tooltips" data-toggle="tooltip" data-placement="top" title="Google Plus">
                      <i className="fa fa-google-plus"></i>
                    </a>
                  </li>
                  <li>
                    <a href="http://www.linkedin.com" className="tooltips" data-toggle="tooltip" data-placement="top" title="Linkedin">
                      <i className="fa fa-linkedin"></i>
                    </a>
                  </li>
                  <li>
                    <a href="http://www.Pinterest.com" className="tooltips" data-toggle="tooltip" data-placement="top" title="Pinterest">
                      <i className="fa fa-pinterest"></i>
                    </a>
                  </li>
                  <li>
                    <a href="http://www.twitter.com" className="tooltips" data-toggle="tooltip" data-placement="top" title="Twitter">
                      <i className="fa fa-twitter"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Footer */}
    </div>
  );
};

export default PrivacyPolicy;
