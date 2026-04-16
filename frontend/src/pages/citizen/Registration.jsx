import React from "react";
import RegistrationForm from "../../components/citizen/registration/RegistrationForm";
import RegistrationHeader from "../../components/citizen/registration/RegistrationHeader";

const Registration = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      
      <div className="max-w-5xl mx-auto">
        <RegistrationHeader />
        <RegistrationForm />
      </div>
      
    </div>
  );
};

export default Registration;