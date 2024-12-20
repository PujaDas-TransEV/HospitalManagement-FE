// import React from 'react';

// const Appointment = () => {
//   return (
//     <div className="wrapper">
//       {/* Header */}
//       <div className="header-v1">
//         {/* Topbar */}
//         <div className="topbar-v1">
//           <div className="container">
//             <div className="row">
//               <div className="col-md-6">
//                 <ul className="list-inline top-v1-contacts">
//                   <li>
//                     <i className="fa fa-envelope"></i> Email: MajidKhan6845@gmail.com
//                   </li>
//                   <li>
//                     <i className="fa fa-phone"></i> Contact no: 0332-4232444
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* End Topbar */}

//         {/* Navbar */}
//         <div className="navbar mega-menu" role="navigation">
//           <div className="container">
//             <div className="res-container">
//               <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-responsive-collapse">
//                 <span className="sr-only">Toggle navigation</span>
//                 <span className="icon-bar"></span>
//                 <span className="icon-bar"></span>
//                 <span className="icon-bar"></span>
//               </button>

//               <div className="navbar-brand">
//                 <a href="index.html">
//                   <img src="assets/img/logo/unity_white.jpg" alt="Logo" />
//                 </a>
//               </div>
//             </div>

//             <div className="collapse navbar-collapse navbar-responsive-collapse">
//               <div className="res-container">
//                 <ul className="nav navbar-nav">
//                   <li className="mega-menu-fullwidth">
//                     <a href="index.html">HOME</a>
//                   </li>
//                   <li className="mega-menu-fullwidth">
//                     <a href="about.html">ABOUT US</a>
//                   </li>
//                   <li className="mega-menu-fullwidth">
//                     <a href="doctors.html">DOCTORS</a>
//                   </li>
//                   <li className="mega-menu-fullwidth">
//                     <a href="gallery.html">GALLERY</a>
//                   </li>
//                   <li className="mega-menu-fullwidth">
//                     <a href="blog.html">BLOGS</a>
//                   </li>
//                   <li className="mega-menu-fullwidth">
//                     <a href="contact.html">CONTACT US</a>
//                   </li>
//                   <li className="mega-menu-fullwidth">
//                     <a href="registration.html">REGISTRATION</a>
//                   </li>
//                   <li className="mega-menu-fullwidth">
//                     <a href="login.html">LOGIN</a>
//                   </li>
//                   <li className="mega-menu-fullwidth">
//                     <a href="appointment.html">BOOK APPOINTMENT</a>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* End Navbar */}

//         {/* Heading */}
//         <div className="container content">
//           <div className="row" style={{ marginBottom: '30px' }}>
//             <div className="col-md-9" style={{ marginBottom: '30px' }}>
//               <div className="headline">
//                 <h2>Appointment Form</h2>
//               </div>

//               {/* Appointment Form */}
//               <form onSubmit={(e) => { e.preventDefault(); showMsg(0); }} method="post" className="sky-form sky-changes-3">
//                 <fieldset>
//                   <div className="row">
//                     <section className="col col-6">
//                       <label className="label">Name</label>
//                       <label className="input">
//                         <i className="icon-append fa fa-user"></i>
//                         <input type="text" name="name" id="name" required />
//                       </label>
//                     </section>
//                     <section className="col col-6">
//                       <label className="label">E-mail</label>
//                       <label className="input">
//                         <i className="icon-append fa fa-envelope-o"></i>
//                         <input type="email" name="email" id="email" required />
//                       </label>
//                     </section>
//                   </div>

//                   <section>
//                     <label className="label">Purpose Of Appointment</label>
//                     <label className="input">
//                       <i className="icon-append fa fa-tag"></i>
//                       <input type="text" name="subject" required />
//                     </label>
//                   </section>

//                   <section>
//                     <label className="label">Mobile Number</label>
//                     <label className="input">
//                       <i className="icon-append fa fa-phone"></i>
//                       <input type="text" name="number" id="number" required />
//                     </label>
//                   </section>

//                   <section>
//                     <label className="select">
//                       <select name="Department" required>
//                         <option value="" selected disabled>Select Department</option>
//                         <option>Cardiology</option>
//                         <option>Dermatology and Cosmetology</option>
//                         <option>General Surgery</option>
//                         <option>Health Checkup Packages</option>
//                         <option>Neurology</option>
//                       </select>
//                       <i></i>
//                     </label>
//                   </section>
//                   <div className="row">
//                     <section className="col col-6">
//                       <label className="date">Select Date</label>
//                       <label className="input">
//                         <i className="icon-append fa fa-calendar"></i>
//                         <input type="date" required />
//                       </label>
//                     </section>
//                     <section className="col col-6">
//                       <label className="time">Select Time</label>
//                       <label className="select">
//                         <select name="Time" required>
//                           <option value="" selected disabled>Select Time</option>
//                           <option>8 AM - 10 AM</option>
//                           <option>10 AM - 12 PM</option>
//                           <option>12 PM - 2 PM</option>
//                           <option>2 PM - 4 PM</option>
//                           <option>4 PM - 6 PM</option>
//                           <option>6 PM - 8 PM</option>
//                           <option>8 PM - 10 PM</option>
//                         </select>
//                         <i></i>
//                       </label>
//                     </section>
//                   </div>

//                   <div className="alert alert-success successBox" style={{ display: 'none' }}>
//                     <button type="button" className="close" onClick={() => showMsg(1)}>×</button>
//                     <strong style={{ fontSize: '16px' }}>Congratulations!</strong><span className="alert-link"> Your Appointment has been booked successfully.</span>
//                   </div>
//                 </fieldset>

//                 <footer>
//                   <button type="submit" className="btn-u">Send message</button>
//                 </footer>
//               </form>
//             </div>

//             {/* Side part of appointment */}
//             <div className="col-md-3" style={{ marginTop: '56px' }}>
//               <div className="headline"><h2>Appointment Notes</h2></div>
//               <p>You Only Can Book Your Appointment Between <strong>8 AM to 10 PM.</strong></p>
//               <p>In Other Times You Can Call Our Ambulance Which Is Available 24/7.</p>

//               {/* Business Hours */}
//               <div className="headline" style={{ marginTop: '20px' }}><h2>Business Hours</h2></div>
//               <ul className="list-unstyled" style={{ marginBottom: '30px' }}>
//                 <li><strong>Monday-Saturday:</strong> 24/7 Available.</li>
//                 <li><strong>Sunday:</strong> 4 AM to 11 PM.</li>
//               </ul>

//               {/* Why Choose Us */}
//               <div className="headline"><h2>Why Choose Us?</h2></div>
//               <p>All healthcare facilities can be accessed here under one roof, making UNITY Hospital a one point contact for all your healthcare needs.</p>
//               <ul className="list-unstyled">
//                 <li><i className="fa fa-check color-green"></i> 24/7 Ambulance Support.</li>
//                 <li><i className="fa fa-check color-green"></i> Eminent and Experienced Doctors.</li>
//                 <li><i className="fa fa-check color-green"></i> Multiple Options For Treatment.</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//         {/* End Content */}

//         {/* Footer */}
//         <div className="footer-v1">
//           <div className="footer">
//             <div className="container">
//               <div className="row">
//                 {/* About */}
//                 <div className="col-md-3" style={{ marginBottom: '40px' }}>
//                   <a href="index.html"><img id="logo-footer" className="footer-logo" src="assets/img/logo/unity_white.jpg" alt="Logo" /></a>
//                   <p>At Unity Hospital, we are convinced that 'quality' and 'lowest cost' are not mutually exclusive when it comes to healthcare delivery.</p>
//                   <p>Our mission is to deliver high quality, affordable healthcare services to the broader population in India.</p>
//                 </div>
//                 {/* Latest Posts */}
//                 <div className="col-md-3" style={{ marginBottom: '40px' }}>
//                   <div className="posts">
//                     <div className="headline"><h2>Latest Posts</h2></div>
//                     <ul className="list-unstyled latest-list">
//                       <li>
//                         <a href="blog.html">Incredible content</a>
//                         <small>December 16, 2020</small>
//                       </li>
//                       <li>
//                         <a href="gallery.html">Latest Images</a>
//                         <small>December 16, 2020</small>
//                       </li>
//                       <li>
//                         <a href="terms.html">Terms and Conditions</a>
//                         <small>December 16, 2020</small>
//                       </li>
//                     </ul>
//                   </div>
//                 </div>
//                 {/* Useful Links */}
//                 <div className="col-md-3" style={{ marginBottom: '40px' }}>
//                   <div className="headline"><h2>Useful Links</h2></div>
//                   <ul className="list-unstyled link-list">
//                     <li><a href="about.html">About us</a><i className="fa fa-angle-right"></i></li>
//                     <li><a href="contact.html">Contact us</a><i className="fa fa-angle-right"></i></li>
//                     <li><a href="appointment.html">Book Appointment</a><i className="fa fa-angle-right"></i></li>
//                   </ul>
//                 </div>
//                 {/* Contact Info */}
//                 <div className="col-md-3 map-img" style={{ marginBottom: '40px' }}>
//                   <div className="headline"><h2>Contact Us</h2></div>
//                   <address className="" style={{ marginBottom: '40px' }}>
//                     Unity Hospital <br />
//                     Ahmedabad, IN <br />
//                     Phone: 886 666 00555 <br />
//                     Email: unityhospital@gmail.com
//                   </address>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="copyright">
//             <div className="container">
//               <div className="row">
//                 <div className="col-md-6">
//                   <p>
//                     2020 &copy; All Rights Reserved.
//                     <a href="privacy.html">Privacy Policy</a> | <a href="terms.html">Terms of Service</a>
//                   </p>
//                 </div>

//                 {/* Social Links */}
//                 <div className="col-md-6">
//                   <ul className="footer-socials list-inline">
//                     <li><a href="http://www.facebook.com" className="tooltips" data-toggle="tooltip" data-placement="top" title="Facebook"><i className="fa fa-facebook"></i></a></li>
//                     <li><a href="http://www.skype.com" className="tooltips" data-toggle="tooltip" data-placement="top" title="Skype"><i className="fa fa-skype"></i></a></li>
//                     <li><a href="http://www.googleplus.com" className="tooltips" data-toggle="tooltip" data-placement="top" title="Google Plus"><i className="fa fa-google-plus"></i></a></li>
//                     <li><a href="http://www.linkedin.com" className="tooltips" data-toggle="tooltip" data-placement="top" title="Linkedin"><i className="fa fa-linkedin"></i></a></li>
//                     <li><a href="http://www.Pinterest.com" className="tooltips" data-toggle="tooltip" data-placement="top" title="Pinterest"><i className="fa fa-pinterest"></i></a></li>
//                     <li><a href="http://www.twitter.com" className="tooltips" data-toggle="tooltip" data-placement="top" title="Twitter"><i className="fa fa-twitter"></i></a></li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Appointment;
