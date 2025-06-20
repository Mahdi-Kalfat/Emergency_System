import React from 'react';
import logo from '../assets/logoEms.png'; 

const Footer = () => {
  return (
    <footer>
      <div className="footer-area section-bg">
        <div className="container">
          <div className="footer-top footer-padding">
            <div className="row d-flex justify-content-between">
              <div className="col-xl-4 col-lg-4 col-md-4 col-sm-8">
                <div className="single-footer-caption mb-50">
                  <div className="logo">
                    <a href="/" className="d-flex align-items-center">
                      <img src={logo} alt="Emergency Logo" className="img-fluid" style={{ height: "120px" }} />
                      <span className="logo-text ms-2" style={{ fontSize: "32px", fontWeight: "700", color: "#3face4" }}>Emergency Services</span>
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-4 col-md-6 col-sm-5">
                <div className="single-footer-caption mb-50">
                  <div className="footer-tittle">
                    <h4>About Us</h4>
                    <div className="footer-pera">
                      <p className="info1">We are dedicated to providing exceptional services and solutions tailored to your needs. Your satisfaction is our priority.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-8">
                <div className="single-footer-caption mb-50">
                  <div className="footer-number mb-50">
                    <h4><span>+216 </span> 97 554 789</h4>
                    <p>EmergencyMS@gmail.com</p>
                  </div>
                  <div className="footer-form">
                    <div id="mc_embed_signup">
                      <form className="subscribe_form relative mail_part">
                        <input type="email" name="EMAIL" placeholder="Email Address" className="placeholder hide-on-focus" />
                        <div className="form-icon">
                          <button type="submit" className="email_icon newsletter-submit button-contactForm">
                            Send
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
