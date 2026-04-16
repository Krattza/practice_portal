import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import VerifyOtp from "./pages/VerifyOtp";

import Citizen from "./pages/citizen/Citizen";
import Admin from "./pages/admin/Admin";
import Registration from "./pages/citizen/Registration";
import Preview from "./pages/citizen/Preview";
import Payment from "./components/citizen/payments/Payment";
import ESign from "./components/citizen/esign/ESign";
import FullSigned from "./components/citizen/esign/FullSigned";




function App() {

  const [email, setEmail] = useState('')
  // Home page should be login and registration

  return (
    <>
      <Routes>
        <Route path="/" element={<Home setEmail={setEmail}/>}></Route>
        <Route path="/verify-otp"  element={<VerifyOtp email={email}/>}></Route>

        
        <Route path="/admin"  element={<Admin/>}></Route>
        <Route path='/citizen' element={<Citizen/>}></Route>
        <Route path='/registration' element={<Registration/>}></Route>
        <Route path='/preview' element={<Preview/>}></Route>
        <Route path='/payment' element={<Payment/>}></Route>
        <Route path='/sign' element={<ESign/>}></Route>
        <Route path='/final-page' element={<FullSigned/>}></Route>

      </Routes>
    </>
  );
}

export default App;
