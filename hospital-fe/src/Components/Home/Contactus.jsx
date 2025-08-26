import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaTwitter } from 'react-icons/fa';

const ContactUs = () => {
  return (
    <div className="bg-white px-6 py-16 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Left Side */}
        <div>
          <h3 className="text-sm text-red-600 font-semibold mb-2 uppercase">Contact Us</h3>
          <h2 className="text-3xl text-blue-700 font-bold mb-6">Reach Out to Us</h2>

          <div className="bg-blue-700 p-8 rounded-lg shadow-lg text-white">
            <p className="mb-6">
              <strong>Get In Touch With Us</strong><br />
              Please fill out the form below for any queries and we will get back to you within 24-48 hours.
            </p>

            <form className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email ID"
                className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none"
              />
              <input
                type="tel"
                placeholder="Phone No"
                pattern="[0-9]{10}"
                title="The mobile number should be of 10 digit"
                className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none"
              />
              <input
                type="text"
                placeholder="Enter Your Subject"
                className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none"
              />
              <textarea
                placeholder="Messages"
                rows="4"
                className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none"
              ></textarea>
              <button
                type="submit"
                className="bg-white text-blue-700 font-bold px-6 py-2 rounded hover:bg-yellow-400 transition"
              >
                Submit
              </button>
            </form>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-3xl text-blue-700 font-bold mb-6">Connect</h2>
            <div className="space-y-6">
              {/* Phone */}
              <div className="flex items-center gap-4">
                <div className="bg-red-600 text-white p-3 rounded-full">
                  <FaPhoneAlt />
                </div>
                <span className="text-gray-700">033 4011 1222</span>
              </div>
              {/* Email */}
              <div className="flex items-center gap-4">
                <div className="bg-red-600 text-white p-3 rounded-full">
                  <FaEnvelope />
                </div>
                <span className="text-gray-700">ph.enquiry@peerlesshospital.com</span>
              </div>
              {/* Location */}
              <div className="flex items-center gap-4">
                <div className="bg-red-600 text-white p-3 rounded-full">
                  <FaMapMarkerAlt />
                </div>
                <span className="text-gray-700">
                  360 Panchasayar, Kolkata - 700 094, West Bengal, India
                </span>
              </div>
            </div>
          </div>

          {/* Follow Us */}
          <div className="mt-10">
            <h3 className="text-blue-700 font-semibold text-lg mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition">
                <FaFacebookF />
              </a>
              <a href="#" className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition">
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactUs;
