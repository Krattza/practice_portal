// import React, { useEffect, useState } from "react";

// const ESign = () => {
//   const [pdfUrl, setPdfUrl] = useState("");
//   const [formData, setFormData] = useState({});

//    const [showOtpModal, setShowOtpModal] = useState(false);
//    const [otp, setOtp] = useState("");
   
//   async function handleEsign() {
//     try {
     
//       const response = await fetch("http://localhost:8500/api/esign/send-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           application_id: formData?.application_id,
//           user_id: formData?.user_id,
//           email: formData?.owner_email,
//         }),
//       });

//       console.log("STATUS:", response.status);
//       const text = await response.text();
//       console.log("RAW RESPONSE:", text);

//       const data = JSON.parse(text);
//       console.log(data);

//        setShowOtpModal(true);

//     } catch (e) {
//       console.log(e);
//     }
//   }

//     async function verifyOtp() {
//     try {
//       const res = await fetch(
//         "http://localhost:8500/api/esign/verify-otp",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             application_id: formData?.application_id,
//             otp,
//           }),
//         }
//       );

//       const data = await res.json();
//       console.log(data);

//       if (data.success) {
//         alert("OTP verified & document signed!");

//         setShowOtpModal(false);
//         setOtp("");

//         // optionally refresh signed pdf
//       } else {
//         alert(data.error || "Verification failed");
//       }
//     } catch (e) {
//       console.log(e);
//     }
//   }
//   // Get the data from the current route
//   useEffect(() => {
//     async function getApplicationPDF() {
//       try {
//         const response = await fetch(
//           "http://localhost:8500/api/forms/current",
//           {
//             credentials: "include",
//           },
//         );

//         const data = await response.json();
//         console.log(data);

//         const res = await fetch("http://localhost:8500/api/forms/get-pdf", {
//           method: "POST",
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(data.data),
//         });

//         setFormData(data.data);

//         const dataTwo = await res.json();
//         console.log(dataTwo);
//         setPdfUrl(`http://localhost:8500${dataTwo.pdf_url}`);
//       } catch (e) {
//         console.log(e);
//       }
//     }
//     getApplicationPDF();
//   }, []);
//   return (
//     <>
//       <h1>Esign</h1>
//       {pdfUrl && (
//         <iframe src={pdfUrl} width="100%" height="600px" title="PDF" />
//       )}

//       <button
//         onClick={handleEsign}
//         className="p-4 bg-black text-white"
//         type="button"
//       >
//         Esign
//       </button>
//     </>
//   );
// };

// export default ESign;

import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';


const ESign = ({ setStep, setDigitalSignature }) => {

  const navigate = useNavigate()

  const [pdfUrl, setPdfUrl] = useState("");
  const [formData, setFormData] = useState({});


  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");

  async function handleEsign() {
    try {
      const response = await fetch(
        "http://localhost:8500/api/esign/send-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            application_id: formData?.application_id,
            user_id: formData?.user_id,
            email: formData?.owner_email,
          }),
        }
      );

      const text = await response.text();
      const data = JSON.parse(text);

      console.log(data);

      setShowOtpModal(true);
    } catch (e) {
      console.log(e);
    }
  }

  async function verifyOtp() {
    try {
      const res = await fetch(
        "http://localhost:8500/api/esign/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            application_id: formData?.application_id,
            otp,
          }),
        }
      );

      const data = await res.json();
      console.log(data);

      if (data.success) {
        alert("OTP verified & document signed!");
        // Object { success: true, signature: "\nDigitally Signed by Pikachu Square\nDate: 16/4/2026, 1:19:53 pm\nApplication ID: 1\nReason: Factory Registration Approval\nLocation: India\n  " }
        setDigitalSignature(data.signature)
        setShowOtpModal(false);
        setOtp("");
       setStep(9)

        // optionally refresh signed pdf
      } else {
        alert(data.error || "Verification failed");
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    async function getApplicationPDF() {
      try {
        const response = await fetch(
          "http://localhost:8500/api/forms/current",
          { credentials: "include" }
        );

        const data = await response.json();

        const res = await fetch(
          "http://localhost:8500/api/forms/get-pdf",
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data.data),
          }
        );

        setFormData(data.data);

        const dataTwo = await res.json();
        setPdfUrl(`http://localhost:8500${dataTwo.pdf_url}`);
      } catch (e) {
        console.log(e);
      }
    }

    getApplicationPDF();
  }, []);

  return (
    <>
      <h1>Esign</h1>

      {pdfUrl && (
        <iframe src={pdfUrl} width="100%" height="600px" title="PDF" />
      )}

      <button
        onClick={handleEsign}
        className="p-4 bg-black text-white"
        type="button"
      >
        Esign
      </button>

  {/* Otpp model */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[300px]">
            <h2 className="text-lg font-bold mb-4">Enter OTP</h2>

            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border p-2 w-full mb-4"
              placeholder="Enter 6-digit OTP"
            />

            <div className="flex justify-between">
              <button
                onClick={() => setShowOtpModal(false)}
                className="px-3 py-1 bg-gray-400 text-white"
              >
                Cancel
              </button>

              <button
                onClick={verifyOtp}
                className="px-3 py-1 bg-black text-white"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ESign;