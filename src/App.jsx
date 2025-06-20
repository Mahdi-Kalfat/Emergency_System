import { useState } from "react";
import "./App.css";
import SignIn from "./pages/SignIn";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import SessionHandler from "./components/SessionHandler";
import ResetPass from "./pages/resetPass";
import AddPersonalForm from "./pages/Personelle/AddPersonelle";
import Profile from "./pages/proflie/Profile";
import Personelle from "./pages/Personelle/Personelle";
import EditPersonalForm from "./pages/Personelle/EditPersonelle";
import AddPatientForm from "./pages/Patient/AddPatient";
import Depot from "./pages/Depot/Depot"
import Reclamation from "./pages/Reclamation/Reclamation";

import "./style.css"; // Importez les styles globaux
// Utilisez l'importation par défaut

import Patient from "./pages/Patient/Patient";
import  Ambulance  from "./pages/Depot/Ambulance";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      {/*<SessionHandler />*/}
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<SignIn />} />
        <Route path="/resetPass/:token" element={<ResetPass />} />

        {/* Protected Route */}
        <Route path="/addPatient" element={<AddPatientForm />} />
        <Route path="/patient" element={<Patient />} />
        <Route path="/ambulance" element={<Ambulance />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addPersonelle"
          element={
            <ProtectedRoute>
              <AddPersonalForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editPersonelle"
          element={
            <ProtectedRoute>
              <EditPersonalForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/personelle"
          element={
            <ProtectedRoute>
              <Personelle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/depot"
          element={
            <ProtectedRoute>
              <Depot />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reclamation"
          element={
            <ProtectedRoute>
              <Reclamation />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
