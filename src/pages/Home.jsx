import React, { useState } from 'react';
import '../App.css';
import Header from '../components/Header';
import SideBar from '../components/SideBar';
import Dashboard from '../pages/Dashboard';

export default function Home() {
  const [sidebarToggle, setSidebarToggle] = useState(false);

  return (
    <div className="app-container">
      <div className="sidebar-container">
        <SideBar sidebarToggle={sidebarToggle} setSidebarToggle={setSidebarToggle} />
      </div>
      <div className="content-container">
        <Header sidebarToggle={sidebarToggle} setSidebarToggle={setSidebarToggle} />
        <Dashboard />
      </div>
    </div>
  );
}
