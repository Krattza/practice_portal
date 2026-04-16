// Modal.jsx
import React from "react";

const DialogueBoxModal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-2xl min-w-[300px] relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl font-bold"
        >
          ×
        </button>

        {children}
      </div>
    </div>
  );
};

export default DialogueBoxModal;