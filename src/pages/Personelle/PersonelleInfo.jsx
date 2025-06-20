import React from 'react';

const UserInfoModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-lg relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">User Information</h2>
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div className="space-y-2">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Country:</strong> {user.country}</p>
          <p><strong>City:</strong> {user.city}</p>
          <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
          <p><strong>Age:</strong> {user.age}</p>
          <p><strong>Admission Date:</strong> {new Date(user.admission_date).toLocaleDateString()}</p>
          <p><strong>Number of Leaves:</strong> {user.nbr_conge}</p>

          {user.role === "Doctor" && (
            <>
              <p><strong>Speciality:</strong> {user.speciality}</p>
              <p><strong>Grade:</strong> {user.grade}</p>
            </>
          )}

          {user.role === "Nurse" && (
            <>
              <p><strong>Poste:</strong> {user.poste_inf}</p>
              <p><strong>Grade:</strong> {user.grade_inf}</p>
            </>
          )}

          {user.role === "Driver" && (
            <>
              <p><strong>Experience:</strong> {user.experience}</p>
              <p><strong>Garde:</strong> {user.garde}</p>
            </>
          )}

          {user.role === "Chef" && (
            <>
              <p><strong>Speciality:</strong> {user.speciality_chief}</p>
              <p><strong>Garde:</strong> {user.garde}</p>
            </>
          )}

          {user.role === "worker" && (
            <>
              <p><strong>Poste:</strong> {user.poste}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfoModal;