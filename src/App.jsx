import { useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './components/Home';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route
import ClaimForm from './components/ClaimForm';
import ClaimList from './components/ClaimsList';
import Contact from './components/Contact';
import Login from './components/Login';
import  rdv from './components/ListRdv';
import ListRdv from './components/ListRdv';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/claim-form" element={<ClaimForm />} />
      <Route path="/claimList" element={<ClaimList />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/rdv" element={<ListRdv />} />
    </Routes>
  );
}

export default App