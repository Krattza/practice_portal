import React, { useEffect, useState } from 'react'

const FullSigned = ({ formData, digitalSignature }) => {

    // just make a useEffect to get the full pdf with signature in it.

     useEffect(() => {
        async function getApplicationPDF() {
          try {
            
             const res = await fetch(
          "http://localhost:8500/api/forms/get-pdf",
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data.data),
          }
        );


          } catch (e) {
            console.log(e);
          }
        }
    
        getApplicationPDF();
      }, []);
  return (
    <>
        <div>
            <h1>FullSigned</h1>

        </div>
    </>
  )
}

export default FullSigned