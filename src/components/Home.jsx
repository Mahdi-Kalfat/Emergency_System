import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../assets/css/style.css'; // Assurez-vous d'avoir importé votre CSS
import Header from './Header'; // Import du composant Header
import Footer from './Footer'; // Import du composant Footer

// Import des images
import logo from '../assets/img/logo/logo.png';
import loder from '../assets/img/logo/loder.png';
import about1 from '../assets/img/gallery/about1.png';
import about2 from '../assets/img/gallery/about2.png';
import departmentMan from '../assets/img/gallery/department_man.png';
import gallery1 from '../assets/img/gallery/gallery1.png';
import gallery2 from '../assets/img/gallery/gallery2.png';
import gallery3 from '../assets/img/gallery/gallery3.png';
import gallery4 from '../assets/img/gallery/gallery4.png';
import gallery5 from '../assets/img/gallery/gallery5.png';
import gallery6 from '../assets/img/gallery/gallery6.png';
import homepageTesti from '../assets/img/gallery/Homepage_testi.png';
import team1 from '../assets/img/gallery/team1.png';
import team2 from '../assets/img/gallery/team2.png';
import team3 from '../assets/img/gallery/team3.png';
import contactForm from '../assets/img/gallery/contact_form.png';
import blog1 from '../assets/img/gallery/blog1.png';
import blog2 from '../assets/img/gallery/blog2.png';
import blog3 from '../assets/img/gallery/blog3.png';
import logoFooter from '../assets/img/logo/logo2_footer.png';
import MedicalServices from './MedicalServices';

const Home = () => {
  useEffect(() => {
    // Initialisation des plugins JS si nécessaire
    // Vous devrez peut-être installer les packages correspondants
  }, []);

  return (
    <div className="main-wrapper">
      {/* Preloader */}
      {/* Header */}
      <Header />
      <main>
        {/* Slider Area */}
        <div className="slider-area position-relative">
          <div className="slider-active">
            {/* Single Slider */}
            <div className="single-slider slider-height d-flex align-items-center">
              <div className="container">
                <div className="row">
                  <div className="col-xl-7 col-lg-9 col-md-8 col-sm-9">
                    <div className="hero__caption">
                      <span>Committed to success</span>
                      <h1 className="cd-headline letters scale">
                        We care about your 
                        <strong className="cd-words-wrapper">
                          <b className="is-visible">health</b>
                          <b>sushi</b>
                          <b>steak</b>
                        </strong>
                      </h1>
                    </div>
                  </div>
                </div>
              </div>          
            </div>
          </div>
        </div>

        {/* About Area */}
        <div className="about-area section-padding2">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-10">
                <div className="about-caption mb-50">
                  <div className="section-tittle section-tittle2 mb-80">
                    <span>About Our Company</span>
                    <h2>Welcome To Our Emergency</h2>
                  </div>
                 
                </div>
              </div>
              <div className="col-lg-6 col-md-12">
                <div className="about-img">
                  <div className="about-font-img d-none d-lg-block">
                    <img src={about2} alt="" />
                  </div>
                  <div className="about-back-img">
                    <img src={about1} alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*department_area_start   */} 
        <MedicalServices />
{/* depertment area end  */}

        {/* Gallery Area */}
        <div className="gallery-area section-padding30">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="section-tittle text-center mb-100">
                  <span>Our Gellary</span>
                  <h2>Our Medical Camp</h2>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="single-gallery mb-30">
                      <div className="gallery-img big-img" style={{backgroundImage: `url(${gallery1})`}}></div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="single-gallery mb-30">
                      <div className="gallery-img small-img" style={{backgroundImage: `url(${gallery2})`}}></div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="single-gallery mb-30">
                      <div className="gallery-img small-img" style={{backgroundImage: `url(${gallery3})`}}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="single-gallery mb-30">
                      <div className="gallery-img small-img" style={{backgroundImage: `url(${gallery4})`}}></div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="single-gallery mb-30">
                      <div className="gallery-img small-img" style={{backgroundImage: `url(${gallery5})`}}></div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="single-gallery mb-30">
                      <div className="gallery-img big-img" style={{backgroundImage: `url(${gallery6})`}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Area */}
        <div className="all-starups-area testimonial-area fix">
          <div className="starups">
            <div className="h1-testimonial-active">
              <div className="single-testimonial text-center">
                <div className="testimonial-caption">
                  <div className="testimonial-top-cap">
                  
                    <p>“I am at an age where I just want to be fit and healthy our bodies are our responsibility! So start caring for your body and it will care for you.”</p>
                  </div>
                  <div className="testimonial-founder d-flex align-items-center justify-content-center">
                    <div className="founder-img">
                      <img src={homepageTesti} alt="" />
                    </div>
                    <div className="founder-text">
                      <span>Margaret Lawson</span>
                      <p>Chif Photographer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="starups-img"></div>
        </div>

{/* Team Area */}
<div className="team-area section-padding30">
  <div className="container">
    <div className="row justify-content-center">
      <div className="col-lg-6">
        <div className="section-tittle text-center mb-100">
          <span>Our Doctors</span>
          <h2>Our Specialist</h2>
        </div>
      </div>
    </div>
    <div className="row">
      {/* single Team 1 */}
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-">
        <div className="single-team mb-30">
          <div className="team-img">
            <img src={team2} alt="Doctor Alvin Maxwell" />
          </div>
          <div className="team-caption">
            <h3><a>Alvin Maxwell</a></h3>
            <span>Cardiologist</span>
            {/* Team social */}
          </div>
        </div>
      </div>
      {/* single Team 2 */}
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-">
        <div className="single-team mb-30">
          <div className="team-img">
            <img src={team3} alt="Doctor Maria Smith" />
          </div>
          <div className="team-caption">
            <h3><a>Maria Smith</a></h3>
            <span>Neurologist</span>
            {/* Team social */}
          </div>
        </div>
      </div>
      {/* single Team 3 */}
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-">
        <div className="single-team mb-30">
          <div className="team-img">
            <img src={team1} alt="Doctor Angela Doe" />
          </div>
          <div className="team-caption">
            <h3><a>Angela Doe</a></h3>
            <span>Pediatrician</span>
            {/* Team social */}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

        {/* Contact Form */}
        <div className="contact-form-main">
          <div className="container">
            <div className="row justify-content-end">
              <div className="col-xl-7 col-lg-7">

              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <Footer />

      {/* Scroll Up */}
      <div id="back-top">
        <a title="Go to Top" href="#"><i className="fas fa-level-up-alt"></i></a>
      </div>
    </div>
  );
};

export default Home;