import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



const Payment = ({ setStep }) => {
  // call a backend make [aytment dummy api end call and make paytment]
  const navigate = useNavigate()
  const [paymentDetails, setPaymentDetails] = useState({});
  const [amount, setAmount] = useState(0);
  async function handleSubmit() {
     if (Number(amount) === paymentDetails?.amount)  {
      alert('Payment Successful')
        setStep((prev)=> prev+1)
    } else {
      alert('Incorrect Amount, Try Again')
    }
        
        
  }

  useEffect(() => {
    async function getPaymentDetails() {
      try {
        const res = await fetch(
          "http://localhost:8500/api/forms/payment-detail",
          {
            method: "GET",
          },
        );
        const data = await res.json(); // 🔥 THIS IS REQUIRED

        console.log("DATA:", data);
        setPaymentDetails(data);
      } catch (e) {
        console.log(e);
      }
    }
    getPaymentDetails();
  }, []);
  

  return (
    <>
      <h1>Payment</h1>

      {/* {
  "application_id": 1,
  "amount": 1500,
  "fee_breakdown": {
    "registration_fee": 1000,
    "inspection_fee": 500
  }
} */}

      <div>
        <p>Amount: {paymentDetails.amount}</p>
        <p>Fee BreakDown:</p>
        <p>
          Registration Free : Rs{" "}
          {paymentDetails.fee_breakdown?.registration_fee}
        </p>
        <p>Inspection Fee: Rs {paymentDetails.fee_breakdown?.inspection_fee}</p>
      </div>

      <input
        onChange={(e) => setAmount(e.target.value)}
        type="text"
        placeholder="Enter the amount"
      ></input>
      <button onClick={handleSubmit} type="button">
        Submit
      </button>
    </>
  );
};

export default Payment;
