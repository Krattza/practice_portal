import React from "react";
import CitizenNavbar from "../../components/citizen/CitizenNavbar";
import DashboardSummary from "../../components/citizen/DashboardSummary";
import CitizenSidebar from "../../components/citizen/CitizenSidebar";

const Dashboard = () => {

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Navbar */}
      <CitizenNavbar />

      {/* Main Layout */}
      <div className="grid grid-cols-12 gap-6 p-6">
        
        {/* Sidebar (slightly less than 25%) */}
        <div className="col-span-3">
          <CitizenSidebar />
        </div>

        {/* Main Content (rest space) */}
        <div className="col-span-9">
          <DashboardSummary />
        </div>
      </div>   
    </div>
  );
};

export default Dashboard;