import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="wrapper">
      {/*=== Header v1 ===*/}
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

        {/* Term Header */}
        <div className="container" style={{ marginTop: '50px' }}>
          <div className="headline-center" style={{ marginBottom: '60px' }}>
            <h2>TERMS AND CONDITIONS</h2>
            <div className="line"></div>
          </div>
        </div>

        {/* Terms */}
        <div className="container content">
          <div className="row-fluid privacy">
            <h4 style={{ marginTop: '-30px' }}>DESCRIPTION OF SERVICES</h4>
            <p>
              All visitors to our WebSite should adhere to the following terms and conditions. BY ACCESSING OR USING THIS WEBSITE, YOU AGREE TO BE BOUND BY THESE TERMS AND CONDITIONS AND ACCEPT THEM IN FULL, AS THEY MAY BE MODIFIED BY UNITY Hospital (for purposes of these terms and conditions the term "UNITY") FROM TIME-TO-TIME AND POSTED ON THIS WEBSITE.
            </p>
            <ol>
              <li>
                <strong>Applicability:-</strong> These website terms and condition are applicable to all transactions including online appointment booking, bill payments, advance payment against services and/or any other transactions through this website or through its hyperlink(s) and authorized third party websites.
              </li>
              <li>
                <strong>Information provided by you:-</strong> We require you to provide us with certain information about yourself when you use the Online Transactions. This information shall include patient’s details and card holder’s name in case of online payment facility. We may also use this information to ensure that the bill payment process is carried out accurately and efficiently.
              </li>
            </ol>
            <ul style={{ marginLeft: '30px' }}>
              <li>You agree to ensure that any information provided by you shall be complete and accurate. You shall not at any time provide us with information which is false, inaccurate, misleading, obsolete or deceptive. If the information is found false/ deceptive/inaccurate/misleading, UNITY holds right to cancel the appointment/ transaction and refund/stop the payment.</li>
              <li> All information provided by you should be true, complete and accurate but not misleading or deceptive;</li>
              <li>The consultation time provided is indicative and actual consultation time may vary.</li>
              <li>Appointment can only be booked between 8 AM to 10 PM.</li>
              <li>Mandatory to produce the valid age proof to avail the Senior Citizen discount else the differential amount should be paid at the counter.</li>
              <li>The appointment slot will be released in case of late arrival of the patient and the patient will be treated as a walk-in patient and consultation should be subject to availability of time with the respective doctor.</li>
            </ul>

            <h4>DISCLAIMER OF WARRANTIES</h4>
            <p>
              All information available on this WebSite, (the “Information”) is provided on the condition that the user will make independent determination in respect of its accuracy, completeness or usefulness suitability prior to use or making any decision or any loss or damage in reliance hereof.
            </p>
            <p>
              The Information does not constitute an invitation or recommendation to take medical services from UNITY nor is such Information a substitute for professional advice or solicitation in respect of medical services/ products or recommendation thereof. UNITY urges the users to seek the advice of professionals, as appropriate, regarding the evaluation of any specific opinion, advice, product, service, or other Information.
            </p>
            <p>
              All information on the site is provided to you "as is" without warranty of any kind either express or implied including, but not limited to implied warranties of merchantability and fitness for a particular purpose, title, non-infringement, security or accuracy. In no event shall UNITY be liable for any special, direct, indirect or consequential damages or any damages whatsoever resulting from loss, whether in an action of contract, negligence or other tortuous action, arising out of or in connection with the use or performance of information. All information available on a hyperlink site and any third party are subject to the terms and conditions of the legal notices contained therein.
            </p>

            <h4>AVAILABILITY</h4>
            <p>
              UNITY operates and controls this WebSite from India and makes no representations that the Information is appropriate for use in any other location across the globe. Information published in this WebSite may contain references to products and services which are available in India and not available in your country. Such references do not imply that UNITY intends to make available such products or services in your country. Users are urged to consult Max UNITY officials for information regarding the products and services available to you.
            </p>

            <h4>INTELLECTUAL PROPERTY RIGHTS</h4>
            <p>
              The contents of this WebSite are protected by applicable intellectual property laws of India including without limitation to trademark and copyright laws. Reproduction, retransmission, public and/or commercial use of any or all the material on this WebSite is prohibited. The logos, service marks and trademarks ("IP Marks") displayed on the WebSite are the property of UNITY or have been licensed to UNITY by the relevant owners for use on this WebSite. Nothing on this WebSite should be construed as granting, by implication, estoppels, or otherwise, any license or right to use any trademarks without our written permission. You are prohibited from using any IP Marks for any purpose without the written permission of UNITY, or the relevant owners thereof.
            </p>
            <p>
              You may use, display, and print copies of the Information only on your personal computer only for your personal non-commercial purpose and use. You are prohibited from modifying, copying, distributing, transmitting, displaying, publishing, selling, licensing, creating derivative works or using any Information available on or through the WebSite for commercial or public purposes, in contravention of the above permitted use.
            </p>

            <h4>LIMITATION OF LIABILITY FOR USE OF THE SITE</h4>
            <p>
              The information available on the site could include inaccuracies or typographic errors. UNITY specifically disclaims any liability for such inaccuracies or errors. UNITY does not warrant or represent that the information on the WebSite is complete or up-to-date, and assumes no obligation to update the WebSite. UNITY may change the information on the WebSite at any time without notice or may make improvements or changes to the WebSite at any time.
            </p>
            <p>
              You agree and undertake that UNITY, its affiliates and any of their respective officers, directors, employees, or agents will not be liable, whether in contract, tort, strict liability or otherwise, for any direct, punitive, special, consequential, incidental or indirect damages (including without limitation lost profits or lost opportunity) arising out of or in connection with the use of this WebSite or a hyperlink site or a third party site, or with delay or inability to use the WebSite, even if UNITY is made aware of the possibility of such damages.
            </p>
          </div>
        </div>

        {/*=== Footer ===*/}
        <div className="footer-v1">
          <div className="footer">
            <div className="container">
              <div className="row">
                {/* About */}
                <div className="col-md-3" style={{ marginBottom: '40px' }}>
                  <a href="index.html">
                    <img id="logo-footer" className="footer-logo" src="assets/img/logo/unity_white.jpg" alt="" />
                  </a>
                  <p>
                    At Unity Hospital, we are convinced that 'quality' and 'lowest cost' are not mutually exclusive when it comes to healthcare delivery.
                  </p>
                  <p>
                    Our mission is to deliver high quality, affordable healthcare services to the broader population in India.
                  </p>
                </div>

                {/* Latest */}
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

                {/* Link List */}
                <div className="col-md-3" style={{ marginBottom: '40px' }}>
                  <div className="headline">
                    <h2>Useful Links</h2>
                  </div>
                  <ul className="list-unstyled link-list">
                    <li>
                      <a href="about.html">About us</a>
                      <i className="fa fa-angle-right"></i>
                    </li>
                    <li>
                      <a href="Contact.html">Contact us</a>
                      <i className="fa fa-angle-right"></i>
                    </li>
                    <li>
                      <a href="appointment.html">Book Appointment</a>
                      <i className="fa fa-angle-right"></i>
                    </li>
                  </ul>
                </div>

                {/* Address */}
                <div className="col-md-3 map-img" style={{ marginBottom: '40px' }}>
                  <div className="headline">
                    <h2>Contact Us</h2>
                  </div>
                  <address>
                    Unity Hospital
                    <br />
                    Ahmedabad, IN
                    <br />
                    Phone: 886 666 00555
                    <br />
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

                {/* Social Links */}
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
                      <a href="http://www.twitter.com" className="tooltips" data-toggle="tooltip" data-placement="top" title="Twitter">
                        <i className="fa fa-twitter"></i>
                      </a>
                    </li>
                    <li>
                      <a href="http://www.linkedin.com" className="tooltips" data-toggle="tooltip" data-placement="top" title="LinkedIn">
                        <i className="fa fa-linkedin"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
