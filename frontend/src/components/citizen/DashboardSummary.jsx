import React from "react";
import ApplicationStatus from "./ApplicationStatus";
import ProgressTracker from "./ProgressTracker";

const DashboardSummary = () => {
  return (
    <>
      <div className="flex flex-col gap-12 p-6">
        {/* Application Status */}
        <div className="w-3/4 bg-white shadow-md rounded-2xl p-4">
          <h2 className="text-lg font-semibold mb-4">Application Status</h2>
          <ApplicationStatus />
        </div>

        {/* Progress Tracker */}
        <div className="w-3/4 bg-white shadow-md rounded-2xl p-4">
          <h2 className="text-lg font-semibold mb-4">Progress</h2>
          <ProgressTracker />
        </div>
      </div>
    </>
  );
};

export default DashboardSummary;
