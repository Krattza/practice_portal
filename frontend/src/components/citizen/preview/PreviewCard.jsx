import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

import FactoryInfoForm from "../registration/registrationForm/FactoryInfoForm";
import OwnerDetailsForm from "../registration/registrationForm/OwnerDetailsForm";
import WorkersForm from "../registration/registrationForm/WorkersForm";
import OperationsForm from "../registration/registrationForm/OperationsForm";
import DocumentsForm from "../registration/registrationForm/DocumentsForm";

const PreviewCard = ({ formData, setFormData, setStep }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const res = await fetch("http://localhost:8500/api/forms/current", {
          method: "GET",
          credentials: "include",
        });
        console.log(res);

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
        console.log(result);
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
        shifts: String(formData.shifts),
      };
      reset(formattedData);
    }
  }, [formData]);

  if (!formData || Object.keys(formData).length === 0) {
    return <div>No Data To Show, Register First</div>;
  }

  return (
    <>
      <div className="p-4 border">
        <h1 className="text-center text-3xl font-semibold">Preview</h1>
      </div>

      {formData && (

        <>

          <FactoryInfoForm register={register} errors={errors} readOnly />

        

          <OwnerDetailsForm register={register} errors={errors} />


          <WorkersForm register={register} errors={errors} />
          <OperationsForm register={register} errors={errors} />
          <DocumentsForm
            formData={formData}
            register={register}
            errors={errors}
          />
          </>
      )}
    </>
  );
};

export default PreviewCard;
