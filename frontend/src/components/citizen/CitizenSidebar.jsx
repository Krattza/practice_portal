import React from "react";
import { useNavigate } from "react-router-dom";

const CitizenSidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-64 bg-white shadow-sm px-6 py-8">
      
      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-800 mb-10">
        Dashboard
      </h2>

      {/* Menu */}
      <div className="flex flex-col gap-4">

        <button
          onClick={() => navigate("/registration")}
          className="text-left text-gray-700 text-base px-3 py-2 rounded-md hover:bg-gray-100 transition"
        >
          Registration
        </button>

        <button
          onClick={() => navigate("/plan")}
          className="text-left text-gray-700 text-base px-3 py-2 rounded-md hover:bg-gray-100 transition"
        >
          Plan
        </button>

        <button
          onClick={() => navigate("/license")}
          className="text-left text-gray-700 text-base px-3 py-2 rounded-md hover:bg-gray-100 transition"
        >
          License
        </button>

      </div>
    </div>
  );
};

export default CitizenSidebar;