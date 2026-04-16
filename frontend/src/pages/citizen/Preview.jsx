import React, { useEffect, useState } from "react";
import FactoryInfoForm from "../../components/citizen/registration/registrationForm/FactoryInfoForm";
import OwnerDetailsForm from "../../components/citizen/registration/registrationForm/OwnerDetailsForm";
import WorkersForm from "../../components/citizen/registration/registrationForm/WorkersForm";
import OperationsForm from "../../components/citizen/registration/registrationForm/OperationsForm";
import DocumentsForm from "../../components/citizen/registration/registrationForm/DocumentsForm";
import { useForm } from "react-hook-form";

const Preview = () => {

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const res = await fetch("http://localhost:8500/api/forms/current", {
          method: "GET",
          credentials: "include",
        });

        if (res.status === 401) {
          console.log("Access Token Expired");

          const refreshRes = await fetch(
            "http://localhost:8500/api/users/refresh",
            {
              method: "POST",
              credentials: "include",
            },
          );

          if (!refreshRes.ok) {
            alert("Session expired. Please login again");
            return;
          }

          const retryRes = await fetch(
            "http://localhost:8500/api/forms/current",
          );

          const result = await retryRes.json();

          setFormData(result.data);
        }

        const result = await res.json();
        setFormData(result.data);
        console.log("Preview Data:", result.data);
      } catch (err) {
        console.error("Error fetching preview:", err);
      }
    };

    fetchPreview();
  }, []);

  useEffect(() => {
    if (formData) {
      const formattedData = {
        ...formData,
        hazardous_process: String(formData.hazardous_process),
        safety_officer: String(formData.safety_officer),
      boiler_installed: String(formData.boiler_installed),
      shifts: String(formData.shifts)
      };
      reset(formattedData);
    }
  }, [formData]);

  if (!formData) return <div>Loading...</div>;

  return (
    <>
      <FactoryInfoForm register={register} />
      <OwnerDetailsForm register={register} />
      <OperationsForm register={register} />
      <WorkersForm register={register} />
      <DocumentsForm register={register} formData={formData}/>
    </>
  );
};

export default Preview;
