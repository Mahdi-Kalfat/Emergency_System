import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { FaEye, FaEyeSlash, FaLock, FaSun, FaMoon, FaTimes } from "react-icons/fa";

const ResetPass = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/users/resetPassword/${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.message || "Password reset failed.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
      <div className="flex flex-1 flex-col lg:flex-row">
        <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6">
          <div className="w-full max-w-md">
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-2xl dark:text-white/90">
                Reset Password
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enter your new password and confirm it to reset your password.
              </p>
            </div>
            <form onSubmit={handleResetPassword}>
              <div className="space-y-5">
                <div>
                  <label className={`mb-1.5 block text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
                    New Password<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="h-11 w-full rounded-lg border border-gray-300 bg-transparent pl-10 pr-11 py-2.5 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-blue-500 transition-all duration-200"
                      required
                    />
                    <span
                      onClick={togglePasswordVisibility}
                      className="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer right-4 top-1/2 dark:text-gray-400"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>

                <div>
                  <label className={`mb-1.5 block text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
                    Confirm Password<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-11 w-full rounded-lg border border-gray-300 bg-transparent pl-10 pr-11 py-2.5 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-blue-500 transition-all duration-200"
                      required
                    />
                    <span
                      onClick={togglePasswordVisibility}
                      className="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer right-4 top-1/2 dark:text-gray-400"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
              </div>

              {error && (
                <p className="mt-4 text-sm text-red-600">
                  {error}
                </p>
              )}

              {success && (
                <p className="mt-4 text-sm text-green-600">
                  Password reset successful! Redirecting to login...
                </p>
              )}

              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full py-3 px-4 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-center w-full lg:w-1/2 bg-gradient-to-r from-blue-500 to-blue-700">
          <div className="text-center">
            {/* Place for an Image */}
            <div className="mb-6">
              <img
                src="../../public/logoEms.png" // Replace with your image URL
                alt="EMS Image"
                className="w-100 h-100 rounded-full mx-auto"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-6">
        <button
          onClick={toggleDarkMode}
          className="p-4 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 shadow-lg"
        >
          {darkMode ? (
            <FaSun className="text-yellow-400 w-6 h-6" />
          ) : (
            <FaMoon className="text-gray-800 w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ResetPass;