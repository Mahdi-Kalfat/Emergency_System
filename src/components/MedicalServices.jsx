import React, { useState } from 'react';
import { FaProcedures, FaBurn, FaHeartbeat, FaBrain, FaAmbulance, FaSyringe } from 'react-icons/fa';
import trauma from '../assets/img/gallery/trauma.png';
import burn from '../assets/img/gallery/burn.png'; // Import burn image
import cardiac from '../assets/img/gallery/cardiac.png'; // Import cardiac image
import neuro from '../assets/img/gallery/Neuro.jpg'; // Import neuro image
import ambulance from '../assets/img/gallery/ambulance.jpg'; // Import ambulance image
import poison from '../assets/img/gallery/poison.png'; // Import poison image

const EmergencyServices = () => {
  const services = [
    {
      id: 'trauma',
      title: 'Trauma Care',
      icon: <FaProcedures className="department-icon" />,
      description: 'Comprehensive trauma care for critical injuries, including fractures, head injuries, and other life-threatening conditions. Our team is equipped to handle emergencies 24/7.',
      image: trauma
    },
    {
      id: 'burn',
      title: 'Burn Treatment',
      icon: <FaBurn className="department-icon" />,
      description: 'Specialized care for burn injuries, including first-degree to third-degree burns. Our burn unit provides advanced treatment and pain management.',
      image: burn // Assign burn image
    },
    {
      id: 'cardiac',
      title: 'Cardiac Emergencies',
      icon: <FaHeartbeat className="department-icon" />,
      description: 'Immediate care for heart attacks, arrhythmias, and other cardiac emergencies. Our team is trained to provide life-saving interventions.',
      image: cardiac // Assign cardiac image
    },
    {
      id: 'neurology',
      title: 'Neuro Emergencies',
      icon: <FaBrain className="department-icon" />,
      description: 'Expert care for strokes, seizures, and other neurological emergencies. Our neurologists are available around the clock for critical cases.',
      image: neuro // Assign neuro image
    },
    {
      id: 'ambulance',
      title: 'Ambulance Services',
      icon: <FaAmbulance className="department-icon" />,
      description: 'Rapid response ambulance services for transporting patients to the emergency department. Our paramedics ensure timely and safe transport.',
      image: ambulance // Assign ambulance image
    },
    {
      id: 'poison',
      title: 'Poison Control',
      icon: <FaSyringe className="department-icon" />,
      description: 'Emergency treatment for poisoning and overdoses. Our toxicology experts provide immediate care and antidotes when necessary.',
      image: poison // Assign poison image
    }
  ];

  // Initialize selectedService with "Trauma Care"
  const [selectedService, setSelectedService] = useState(services[0]);

  return (
    <div className="department_area section-padding2">
      <div className="container">
        {/* Section Title */}
        <div className="row">
          <div className="col-lg-12">
            <div className="section-tittle text-center mb-100">
              <span>Our Services</span>
              <h2>Emergency Department Services</h2>
            </div>
          </div>
        </div>
        
        <div className="row">
          <div className="col-lg-12">
            <div className="depart_ment_tab mb-30">
              {/* Tabs Navigation */}
              <ul className="nav" id="myTab" role="tablist">
                {services.map((service) => (
                  <li className="nav-item" key={service.id}>
                    <button
                      className={`nav-link ${selectedService?.id === service.id ? 'active' : ''}`}
                      onClick={() => setSelectedService(service)} // Met à jour le service sélectionné
                    >
                      {service.icon}
                      <h4>{service.title}</h4>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Selected Service Description */}
        {selectedService && (
          <div className="dept_main_info white-bg">
            <div className="row align-items-center no-gutters">
              <div className="col-lg-7">
                <div className="dept_info">
                  <h3>{selectedService.title}</h3>
                  <p>{selectedService.description}</p>
                </div>
              </div>
              <div className="col-lg-5">
                <div className="dept_thumb">
                  <img src={selectedService.image || 'assets/img/gallery/department_man.png'} alt={selectedService.title} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyServices;