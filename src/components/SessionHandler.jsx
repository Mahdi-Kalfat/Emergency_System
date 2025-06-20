import React, { useEffect } from 'react';
import Cookies from 'js-cookie';

const SessionHandler = () => {
  const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  let inactivityTimer;

  const startInactivityTimer = () => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }

    const lastActivityTime = localStorage.getItem('lastActivityTime');
    const currentTime = new Date().getTime();

    if (lastActivityTime) {
      const elapsedTime = currentTime - parseInt(lastActivityTime, 10);
      const remainingTime = INACTIVITY_TIMEOUT - elapsedTime;

      if (remainingTime > 0) {
        inactivityTimer = setTimeout(logout, remainingTime);
      } else {
        logout();
      }
    } else {
      inactivityTimer = setTimeout(logout, INACTIVITY_TIMEOUT);
    }
  };

  const resetInactivityTimer = () => {
    localStorage.setItem('lastActivityTime', new Date().getTime());
    startInactivityTimer();
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('lastActivityTime');
    Cookies.remove('token');
    window.location.href = '/';
  };

  const handleBeforeUnload = (event) => {
    // Check if the page is being reloaded
    const isReloading = sessionStorage.getItem('isReloading');

    if (!isReloading) {
      // If not reloading, clear the session (page is being closed)
      localStorage.removeItem('user');
      localStorage.removeItem('lastActivityTime');
      Cookies.remove('token');
    }
  };

  useEffect(() => {
    // Check if the page is being reloaded
    const isReloading = sessionStorage.getItem('isReloading');

    if (isReloading) {
      // If reloading, remove the flag and do not clear the session
      sessionStorage.removeItem('isReloading');
    } else {
      // If not reloading, set the reload flag for the next load
      sessionStorage.setItem('isReloading', 'true');
    }

    startInactivityTimer();

    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('keydown', resetInactivityTimer);
    window.addEventListener('scroll', resetInactivityTimer);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      window.removeEventListener('mousemove', resetInactivityTimer);
      window.removeEventListener('keydown', resetInactivityTimer);
      window.removeEventListener('scroll', resetInactivityTimer);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return null;
};

export default SessionHandler;