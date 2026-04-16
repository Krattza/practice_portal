import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom'

import DeclarationForm from "./registrationForm/DeclarationForm";
import DocumentsForm from "./registrationForm/DocumentsForm";
import FactoryInfoForm from "./registrationForm/FactoryInfoForm";
import OperationsForm from "./registrationForm/OperationsForm";
import OwnerDetailsForm from "./registrationForm/OwnerDetailsForm";
import WorkersForm from "./registrationForm/WorkersForm";

import PreviewCard from '../preview/PreviewCard'
import Payment from "../payments/Payment";
import ESign from "../esign/ESign";
import FullSigned from "../esign/FullSigned";



const RegistrationForm = () => {

  const navigate = useNavigate()
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [digitalSignature, setDigitalSignature] = useState({})

  const isPreview = step >= 6

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      factory_type: "",
      hazardous_process: "",
      safety_officer: "",
      boiler_installed: "",
      shifts: ""
    },
  });

const onSubmit = async (data) => {
  const createFormData = () => {
    const fd = new FormData();

    Object.keys(data).forEach((key) => {
      if (data[key] instanceof FileList) {
        fd.append(key, data[key][0]);
      } else {
        fd.append(key, data[key]);
      }
    });

    return fd;
  };

  try {
    let response = await fetch("http://localhost:8500/api/forms/register", {
      method: "POST",
      credentials: "include",
      body: createFormData(),
    });

    console.log(response)

    // 🔥 Handle expired access token
    if (response.status === 401) {
      console.log("Access token expired, refreshing...");

      const refreshRes = await fetch("http://localhost:8500/api/users/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!refreshRes.ok) {
        alert("Session expired. Please login again.");
        return;
      }

      // retry original request
      response = await fetch("http://localhost:8500/api/forms/register", {
        method: "POST",
        credentials: "include",
        body: createFormData(),
      });
    }

    const result = await response.json();

    if (!response.ok) {
      console.error("Error:", result);
      alert(result.message || "Something went wrong");
      return;
    }

    console.log("Success:", result);
    alert("Form submitted successfully");
    setStep(6);
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Server not reachable");
  }
};

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full bg-white shadow-sm rounded-xl p-8 min-h-[400px]"
    >
      {step === 1 && <FactoryInfoForm register={register} errors={errors}  />}
      {step === 2 && <OwnerDetailsForm register={register} errors={errors}  />}
      {step === 3 && <OperationsForm register={register} errors={errors} />}
      {step === 4 && <WorkersForm register={register} errors={errors} />}
      {step === 5 && <DocumentsForm register={register} errors={errors} />}
      {step === 6 && <PreviewCard formData={formData} setFormData={setFormData} setStep={setStep}/>}
      {step === 7 && <Payment setStep={setStep} />}
      {step === 8 && <ESign setStep={setStep} setDigitalSignature={setDigitalSignature} formData={formData} />}
      {step === 9 && <FullSigned formData={formData} digitalSignature={digitalSignature} />}

      {!isPreview && <div className="flex justify-between mt-6">
        {/* Prev */}
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          disabled={step === 1}
          className="px-5 py-2 bg-gray-200 rounded-md disabled:opacity-50"
        >
          Previous
        </button>

      
        <button
  type="button"
  onClick={
    step === 5
      ? handleSubmit(onSubmit)  
      : () => setStep(step + 1)
  }
  disabled={step === 6}
  className="px-5 py-2 bg-black text-white rounded-md disabled:opacity-50"
>
  {step === 5 ? "Preview" : "Next"}


</button>
      </div>
}

  {step === 6 && (
  <div className="flex justify-between mt-6">
    <button onClick={()=> setStep(1)}
      type="button"
      className="px-6 py-2 bg-black text-white rounded-md"
    >
      Make Edit
    </button>
    <button 
    onClick={()=>setStep(7)}
      type="button"
      className="px-6 py-2 bg-black text-white rounded-md"
    >
      Make Payment
    </button>
  </div>
)}
      {/* Submit Button */}
      {/* <div className="mt-6">
        <button
          type="submit"
          className="px-6 py-2 bg-black text-white rounded-md"
        >
          Submit
        </button>
      </div> */}
    </form>
  );
};

export default RegistrationForm;

 {/* Next or Submit */}
        {/* {step < 6 ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            className="px-5 py-2 bg-black text-white rounded-md"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            className={`px-5 py-2 rounded-md transition
    ${
      step === 5
        ? "Preview"
        : "Next"
    }`}
          >
            Next
          </button>
        )} */}

//   const onSubmit = async (data) => {
    

//     const formData = new FormData();

// // append normal fields
// Object.keys(data).forEach((key) => {
//   if (data[key] instanceof FileList) {
//     formData.append(key, data[key][0]); // take first file
//   } else {
//     formData.append(key, data[key]);
//   }
// });

// for (let pair of formData.entries()) {
//   console.log(pair[0], pair[1]);
// }

//     try {
//       const response = await fetch("http://localhost:8500/api/forms/register", {
//         method: "POST",
//         credentials: "include", // since you're using cookies (CORS enabled)
//         body: formData,
//       });

//       const result = await response.json();

//       console.log(result);

//       if (response.status === 401) {
//   // call refresh
//   await fetch("http://localhost:8500/api/users/refresh", {
//     method: "POST",
//     credentials: "include",
//   });

//   // retry original request
//   const retryResponse = await fetch("/api/forms/register", {
//     method: "POST",
//     credentials: "include",
//     body: formData,
//   });

//   return retryResponse;
// }
//       if (!response.ok) {
//         console.error("Error:", result);
//         alert(result.message || "Something went wrong");
//         return;
//       }

//       console.log("Success:", result);
//       alert("Form submitted successfully");
//       navigate('/preview')
//     } catch (error) {
//       console.error("Fetch error:", error);
//       alert("Server not reachable");
//     }
//   };
