import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const VerifyOtp = ({ email }) => {

  const [otp, setOtp] = useState("");

const navigate = useNavigate()

  async function handleSubmit() {
    console.log(email)
    console.log(otp)
    try {
      const response = await axios.post(
        "http://localhost:8500/api/users/verify-user",
        { otp, email },
      );
      console.log(response);

      if (response.status === 200) {
        navigate("/"); // go to login/home page
      }
    } catch (e) {
      console.log(e);
      if (e.response && e.response.status === 400) {
        alert("Incorrect OTP");
      } else {
        alert("Something went wrong");
      }
    }
  }

  return (
    <>
      <div className="min-h-screen flex flex-col gap-4 justify-center items-center border-2 border-black">
        <h1 className="text-2xl font-bold ">Verify OTP Please</h1>
        <input
          className="placeholder:font-gray outline-none border-2 border-black py-4 px-8"
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Please Enter Your OTP"
        />
        <button
          className="py-4 px-8 rounded-xl bg-black text-white"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </>
  );
};

export default VerifyOtp;
