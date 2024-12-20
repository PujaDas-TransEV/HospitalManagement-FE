import React from 'react';

const GalleryPage = () => {
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
        {/* End Topbar */}

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
        {/* End Navbar */}

        {/* Image title */}
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h2>GALLERY</h2>
        </div>
        {/* End title */}

        {/* Cube Portfolio */}
        <div
          className="cube-portfolio container"
          style={{ marginTop: '100px', marginBottom: '60px' }}
        >
          <div id="grid-container" className="cbp-l-grid-agency">
            {/* Image */}
            <div className="cbp-item graphic">
              <div className="cbp-caption" style={{ marginBottom: '20px' }}>
                <div className="cbp-caption-defaultWrap">
                  <a
                    href="assets/img/gallery/room1.jpg"
                    className="cbp-lightbox"
                    data-title="Rooms for patients"
                  >
                    <img src="assets/img/gallery/room1.jpg" alt="" />
                  </a>
                </div>
              </div>
              <div className="cbp-title-dark">
                <div className="cbp-l-grid-agency-title">Rooms for patients</div>
              </div>
            </div>
            {/* End image */}

            {/* Image */}
            <div className="cbp-item graphic">
              <div className="cbp-caption" style={{ marginBottom: '20px' }}>
                <div className="cbp-caption-defaultWrap">
                  <a
                    href="assets/img/gallery/opd.jpg"
                    className="cbp-lightbox"
                    data-title="OPD Area"
                  >
                    <img src="assets/img/gallery/opd.jpg" alt="" />
                  </a>
                </div>
              </div>
              <div className="cbp-title-dark">
                <div className="cbp-l-grid-agency-title">OPD Area</div>
              </div>
            </div>
            {/* End image */}

            {/* More Images */}
            <div className="cbp-item graphic">
              <div className="cbp-caption" style={{ marginBottom: '20px' }}>
                <div className="cbp-caption-defaultWrap">
                  <a
                    href="assets/img/gallery/opd2.jpg"
                    className="cbp-lightbox"
                    data-title="OPD Area 2"
                  >
                    <img src="assets/img/gallery/opd2.jpg" alt="" />
                  </a>
                </div>
              </div>
              <div className="cbp-title-dark">
                <div className="cbp-l-grid-agency-title">Opd area</div>
              </div>
            </div>

            <div className="cbp-item graphic">
              <div className="cbp-caption" style={{ marginBottom: '20px' }}>
                <div className="cbp-caption-defaultWrap">
                  <a
                    href="assets/img/gallery/parking.jpg"
                    className="cbp-lightbox"
                    data-title="Parking Area"
                  >
                    <img src="assets/img/gallery/parking.jpg" alt="" />
                  </a>
                </div>
              </div>
              <div className="cbp-title-dark">
                <div className="cbp-l-grid-agency-title">Parking area</div>
              </div>
            </div>

            <div className="cbp-item graphic">
              <div className="cbp-caption" style={{ marginBottom: '20px' }}>
                <div className="cbp-caption-defaultWrap">
                  <a
                    href="assets/img/gallery/reception.jpg"
                    className="cbp-lightbox"
                    data-title="Reception"
                  >
                    <img src="assets/img/gallery/reception.jpg" alt="" />
                  </a>
                </div>
              </div>
              <div className="cbp-title-dark">
                <div className="cbp-l-grid-agency-title">Reception</div>
              </div>
            </div>

            <div className="cbp-item graphic">
              <div className="cbp-caption" style={{ marginBottom: '20px' }}>
                <div className="cbp-caption-defaultWrap">
                  <a
                    href="assets/img/gallery/cath_lab.jpg"
                    className="cbp-lightbox"
                    data-title="Cath laboratory"
                  >
                    <img src="assets/img/gallery/cath_lab.jpg" alt="" />
                  </a>
                </div>
              </div>
              <div className="cbp-title-dark">
                <div className="cbp-l-grid-agency-title">Cath laboratory</div>
              </div>
            </div>

            <div className="cbp-item graphic">
              <div className="cbp-caption" style={{ marginBottom: '20px' }}>
                <div className="cbp-caption-defaultWrap">
                  <a
                    href="assets/img/gallery/platinum_wing.jpg"
                    className="cbp-lightbox"
                    data-title="Platinum Wing"
                  >
                    <img src="assets/img/gallery/platinum_wing.jpg" alt="" />
                  </a>
                </div>
              </div>
              <div className="cbp-title-dark">
                <div className="cbp-l-grid-agency-title">Platinum Wing</div>
              </div>
            </div>

            <div className="cbp-item graphic">
              <div className="cbp-caption" style={{ marginBottom: '20px' }}>
                <div className="cbp-caption-defaultWrap">
                  <a
                    href="assets/img/gallery/Hospital.jpg"
                    className="cbp-lightbox"
                    data-title="Hospital"
                  >
                    <img src="assets/img/gallery/Hospital.jpg" alt="" />
                  </a>
                </div>
              </div>
              <div className="cbp-title-dark">
                <div className="cbp-l-grid-agency-title">Hospital</div>
              </div>
            </div>
          </div>
        </div>
        {/* End Cube Portfolio */}

        {/* Footer */}
        <div className="footer-v1">
          <div className="footer">
            <div className="container">
              <div className="row">
                <div className="col-md-3" style={{ marginBottom: '40px' }}>
                  <a href="index.html">
                    <img
                      id="logo-footer"
                      className="footer-logo"
                      src="assets/img/logo/unity_white.jpg"
                      alt=""
                    />
                  </a>
                  <p>
                    At Unity Hospital, we are convinced that 'quality' and 'lowest cost' are not
                    mutually exclusive when it comes to healthcare delivery.
                  </p>
                  <p>
                    Our mission is to deliver high quality, affordable healthcare services to the
                    broader population in India.
                  </p>
                </div>
                {/* End About */}

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
                {/* End Latest Posts */}
              </div>
            </div>
          </div>
        </div>
        {/* End Footer */}
      </div>
    </div>
  );
};

export default GalleryPage;
