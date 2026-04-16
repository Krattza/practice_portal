import React from "react";

const OwnerDetailsForm = ({ register, errors }) => {
  return (
    <div className="bg-white shadow-sm rounded-xl p-8">

      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Owner Information
      </h2>

      <div className="grid grid-cols-2 gap-6">

        {/* Owner Name */}
        <div className="col-span-2">
          <label className="block text-sm mb-1">Owner Name *</label>
          <input
            type="text"
            {...register("owner_name", { required: true })}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        {/* Owner Email */}
        <div className="col-span-2">
          <label className="block text-sm mb-1">Owner Email</label>
          <input
            type="email"
            {...register("owner_email")}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        {/* Owner Mobile */}
        <div>
          <label className="block text-sm mb-1">Owner Mobile</label>
          <input
            type="tel"
            {...register("owner_mobile")}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        {/* Owner Aadhar */}
        <div>
          <label className="block text-sm mb-1">Aadhar Number</label>
          <input
            type="text"
            {...register("owner_aadhar")}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        {/* Owner PAN */}
        <div>
          <label className="block text-sm mb-1">PAN Number</label>
          <input
            type="text"
            {...register("owner_pan")}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        {/* DOB */}
        {/* <div>
          <label className="block text-sm mb-1">Date Of Birth</label>
          <input
            type="date"
            {...register("owner_dob")}
            className="w-full border rounded-md px-3 py-2"
          />
        </div> */}

        {/* Gender */}
        <div>
          <label className="block text-sm mb-1">Gender</label>
          <select
            {...register("owner_gender")}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

      </div>
    </div>
  );
};

export default OwnerDetailsForm;