import React from "react";

const DeclarationForm = ({ register }) => {
  return (
    <div className="bg-white shadow-sm rounded-xl p-8">
      <h2 className="text-xl font-semibold mb-6">Declaration</h2>

      <div className="space-y-4">

        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("declaration_accepted")} />
          I confirm all details are correct
        </label>

        <input
          type="text"
          placeholder="Digital Signature"
          {...register("digital_signature")}
          className="w-full border rounded-md px-3 py-2"
        />

      </div>
    </div>
  );
};

export default DeclarationForm;