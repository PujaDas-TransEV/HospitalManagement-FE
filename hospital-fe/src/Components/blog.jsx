import React from 'react';

const BlogPage = () => {
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
                    <i className="fa fa-phone"></i> Contact no: 0332-4232444
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
        <div style={{ textAlign: 'center', marginTop: '50px', marginBottom: '40px' }}>
          <h2>BLOGS</h2>
        </div>
        {/* End title */}

        {/* Content Part */}
        <div className="container content">
          <ul className="timeline-v1">
            {/* Blog 1 */}
            <li>
              <div className="timeline-badge primary">
                <i className="glyphicon glyphicon-record"></i>
              </div>
              <div className="timeline-panel">
                <div className="timeline-heading">
                  <img className="img-responsive" src="assets/img/blogs/1.jpg" alt="" />
                </div>
                <div className="timeline-body text-justify">
                  <h2 className="font-light">
                    <a href="#">How to maintain bone and joint health during winters?</a>
                  </h2>
                  <p>
                    It is usually due to restricted absorption of Vitamin D (sunlight) in your body during winter or due to decreased blood flow to bones to increase body temperature or due to restricted mobility to conserve energy which allows accumulation of inflammatory markers or toxins in joints. This leads to stiffness and pain in joints. Ignoring problems related to bones and joints can lead to further deterioration.
                  </p>
                  <p>These are few tips to keep your joints and muscles healthy during this winter:</p>
                  <p>
                    1) A balanced diet is key to overall healthy living. Eat a diet that comprises fruits, vegetables, cereals, dairy products, and pulses.<br />
                    2) Eat foods rich in Vitamin K, D, and C.<br />
                    3) Physical activity is also important. Exercising strengthens the muscles and maintains weight.<br />
                    4) Do not overeat and reduce weight.
                  </p>
                </div>
                <div className="timeline-footer">
                  <ul className="list-inline news-v1-info">
                    <li><span style={{ marginLeft: '120px' }}>By</span> <a href="#">Dr. Ramneek Mahajan</a></li>
                    <li>|</li>
                    <li><i className="fa fa-clock-o"></i> December 31, 2020</li>
                  </ul>
                </div>
              </div>
            </li>
            {/* End of Blog 1 */}

            {/* Blog 2 */}
            <li className="timeline-inverted">
              <div className="timeline-badge primary">
                <i className="glyphicon glyphicon-record invert"></i>
              </div>
              <div className="timeline-panel">
                <div className="timeline-heading">
                  <img className="img-responsive" src="assets/img/blogs/2.jpg" alt="" />
                </div>
                <div className="timeline-body text-justify">
                  <h2 className="font-light">
                    <a href="#">Robot Assisted Kidney Transplant in France</a>
                  </h2>
                  <p>
                    First robot-assisted kidney transplant (RAKT) was performed in France in 2002. Since then, it is gradually gaining a foothold in transplant arenas. The majority of work is being done in India, Europe, and a few centers in the USA. Worldwide experience has established its functional outcomes comparable to open transplant. The patient has got multiple benefits:
                  </p>
                  <p>1) Lesser pain – early mobility, early recovery</p>
                  <p>2) Less chance of wound infection – no adverse effect on graft function</p>
                  <p>3) Less blood loss, minimal scars, improved cosmetic effects</p>
                  <p>Max Super Specialty Hospital, Saket, New Delhi is amongst the few centers across the world routinely doing RAKT.</p>
                </div>
                <div className="timeline-footer">
                  <ul className="list-unstyled list-inline blog-info">
                    <li><span style={{ marginLeft: '120px' }}>By</span> <a href="#">Dr. Anant Kumar</a></li>
                    <li>|</li>
                    <li><i className="fa fa-clock-o"></i> December 31, 2020</li>
                  </ul>
                </div>
              </div>
            </li>
            {/* End of Blog 2 */}

            {/* Blog 3 */}
            <li>
              <div className="timeline-badge primary">
                <i className="glyphicon glyphicon-record"></i>
              </div>
              <div className="timeline-panel">
                <div className="timeline-heading">
                  <img className="img-responsive" src="assets/img/blogs/3.jpg" alt="" />
                </div>
                <div className="timeline-body text-justify">
                  <h2 className="font-light">
                    <a href="#">Body Weight - What you must know!</a>
                  </h2>
                  <p>Q: Why is body weight so important to us?</p>
                  <p>A: Bodyweight is a vital part of our physical and mental health.</p>
                  <p>Q: What is an ideal body weight?</p>
                  <p>A: There is no single defined value for an ideal weight. The ideal weight for a person depends on their height and age.</p>
                  <p>Q: Why is there a weight range?</p>
                  <p>A: Your weight depends upon a number of factors. These include your age, muscle mass fat mass, gender, and body shape.</p>
                </div>
                <div className="timeline-footer">
                  <ul className="list-unstyled list-inline blog-info">
                    <li><span style={{ marginLeft: '120px' }}>By</span> <a href="#">Dr. Vandana Soni</a></li>
                    <li>|</li>
                    <li><i className="fa fa-clock-o"></i> December 31, 2020</li>
                  </ul>
                </div>
              </div>
            </li>
            {/* End of Blog 3 */}

            {/* Blog 4 */}
            <li className="timeline-inverted">
              <div className="timeline-badge primary">
                <i className="glyphicon glyphicon-record invert"></i>
              </div>
              <div className="timeline-panel">
                <div className="timeline-heading">
                  <img className="img-responsive" src="assets/img/blogs/4.jpg" alt="" />
                </div>
                <div className="timeline-body text-justify">
                  <h2 className="font-light">
                    <a href="#">IMPORTANCE OF SLEEP IN BRAIN HEALTH</a>
                  </h2>
                  <p>
                    Those mood swings are for real…. Your brain regulates the hormones and the neurotransmitters. These chemicals are basically responsible for the way you feel. Chemical compounds like dopamine, serotonin, and oxytocin help us feel good, happy, and upbeat. Sleep plays an important role in their regulation. Lack of sleep can make you irritated, impulsive, and angry.
                  </p>
                  <p>
                    Lack of sleep makes you slow. Sleep deprivation slows down the brain’s ability to react quickly. Tired drivers and pilots tend to have more accidents, and that is a well-known fact. Sleep deprivation slows down the brain akin to getting drunk.
                  </p>
                </div>
                <div className="timeline-footer">
                  <ul className="list-unstyled list-inline blog-info">
                    <li><span style={{ marginLeft: '120px' }}>By</span> <a href="#">Dr. Manish Baijal</a></li>
                    <li>|</li>
                    <li><i className="fa fa-clock-o"></i> December 31, 2020</li>
                  </ul>
                </div>
              </div>
            </li>
            {/* End of Blog 4 */}
          </ul>
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
                  <p>
                    At Unity Hospital, we are convinced that 'quality' and 'lowest cost' are not mutually exclusive when it comes to healthcare delivery.
                  </p>
                  <p>
                    Our mission is to deliver high quality, affordable healthcare services to the broader population in India.
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

                {/* Useful Links */}
                <div className="col-md-3" style={{ marginBottom: '40px' }}>
                  <div className="headline">
                    <h2>Useful Links</h2>
                  </div>
                  <ul className="list-unstyled link-list">
                    <li><a href="about.html">About us</a><i className="fa fa-angle-right"></i></li>
                    <li><a href="Contact.html">Contact us</a><i className="fa fa-angle-right"></i></li>
                    <li><a href="appointment.html">Book Appointment</a><i className="fa fa-angle-right"></i></li>
                    <li><a href="gallery.html">Gallery</a><i className="fa fa-angle-right"></i></li>
                  </ul>
                </div>
                {/* End Useful Links */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
