import React from 'react';
import '../assets/css/style.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Header from './Header';
import Footer from './Footer';

const Contact = () => {
  return (
    <div className="main-wrapper">
      <Header />
      
      {/* Hero Section améliorée */}
      <div className="slider-area2 contact-hero">
        <div className="slider-height2 d-flex align-items-center">
          <div className="container">
            <div className="row">
              <div className="col-xl-12">
                <div className="hero-cap hero-cap2 text-center">
                  <h2>Contact Us</h2>
                  <p className="hero-subtitle">We're always happy to hear from you</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section améliorée */}
      <section className="contact-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 text-center mb-5">
              <h2 className="contact-title">Get in Touch</h2>
              <p className="contact-subtitle">Our team is ready to assist you</p>
            </div>
            
            <div className="col-lg-10">
              <div className="row justify-content-center">
                {/* Adresse */}
                <div className="col-lg-4 col-md-6 mb-4">
                  <div className="media contact-info">
                    <span className="contact-info__icon">
                      <i className="fas fa-map-marker-alt"></i>
                    </span>
                    <div className="media-body">
                    <h3>Our Location</h3>
                    <p>Tunis, Tunisia</p>
                    <p>1002, Tunis</p>
                    <a href="#" className="direction-link">Get directions <i className="fas fa-arrow-right"></i></a>
                    </div>
                  </div>
                </div>
                
                {/* Téléphone */}
                <div className="col-lg-4 col-md-6 mb-4">
                  <div className="media contact-info">
                    <span className="contact-info__icon">
                      <i className="fas fa-phone-alt"></i>
                    </span>
                    <div className="media-body">
                      <h3>Phone Numbers</h3>
                      <p>Main: +216 27 465 334</p>
                      <p>Emergency: +216 97 554 789</p>
                      <p className="hours">Mon to Fri 9am to 6pm</p>
                    </div>
                  </div>
                </div>
                
                {/* Email et réseaux sociaux */}
                <div className="col-lg-4 col-md-6 mb-4">
                  <div className="media contact-info">
                    <span className="contact-info__icon">
                      <i className="fas fa-envelope"></i>
                    </span>
                    <div className="media-body">
                      <h3>Email Us</h3>
                      <p>General: EmergencyMS@gmail.com</p>
                      <div className="social-links">
                        <a href="#"><i className="fab fa-facebook-f"></i></a>
                        <a href="#"><i className="fab fa-twitter"></i></a>
                        <a href="#"><i className="fab fa-instagram"></i></a>
                        <a href="#"><i className="fab fa-linkedin-in"></i></a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Carte Google Maps améliorée */}
              <div className="map-container">
  <iframe 
    title="Google Maps"
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127672.75772082225!2d10.059234499999999!3d36.8005284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd337f5e7ef543%3A0xd671924e714a0275!2sTunis%2C%20Tunisie!5e0!3m2!1sfr!2s!4v1715100000000!5m2!1sfr!2s" 
    width="100%" 
    height="450" 
    style={{border:0}} 
    allowFullScreen="" 
    loading="lazy">
  </iframe>
</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;