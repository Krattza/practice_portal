import React from "react";
import { useState } from "react";
import DialogueBoxModal from "./DialogueBoxModal";
import Login from "./Login";
import Register from "./Register";

const Navbar = ({setEmail}) => {

  const [activeModal, setActiveModal] = useState(null);

  return (
    <>
      <div className="min-w-screen flex justify-between px-8 py-4 b-2 border-black">
        <div>
          <h1 className="text-3xl font-bold">Practice Portal</h1>
        </div>
        <div className="flex gap-8">
          <button onClick={()=> setActiveModal('login')} className="px-8 py-4 bg-black text-white rounded-2xl">
            Sign In
          </button>
          <button onClick={()=> setActiveModal('register')} className="px-8 py-4 bg-black text-white rounded-2xl">
            Register
          </button>
        </div>
      </div>
      {activeModal && (
        <DialogueBoxModal onClose={() => setActiveModal(null)}>
          {activeModal === "login" && <Login />}
          {activeModal === "register" && <Register setEmail={setEmail}/>}
        </DialogueBoxModal>
      )}
    </>
  );
};

export default Navbar;
