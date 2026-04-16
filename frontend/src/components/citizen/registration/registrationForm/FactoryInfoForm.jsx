import React, { useEffect } from "react";

const FactoryInfoForm = ({ register, errors }) => {


  return (
    <div className="bg-white shadow-sm rounded-xl p-8">

      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Factory Information
      </h2>

      <div className="grid grid-cols-2 gap-6">

        {/* Factory Name */}
        <div className="col-span-2">
          <label className="block text-sm mb-1">Factory Name *</label>
          <input
            type="text"
            {...register("factory_name", { required: true })}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        {/* Address */}
        <div className="col-span-2">
          <label className="block text-sm mb-1">Address</label>
          <textarea
            {...register("factory_address")}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        {/* Pincode */}
        <div>
          <label className="block text-sm mb-1">Pincode</label>
          <input
            type="number"
            {...register("factory_pincode")}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm mb-1">Factory Email</label>
          <input
            type="email"
            {...register("factory_email")}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm mb-1">Phone</label>
          <input
            type="tel"
            {...register("factory_phone")}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        {/* Factory Type */}
        <div>
          <label className="block text-sm mb-1">Factory Type</label>
          <select
            {...register("factory_type")}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">Select</option>
            <option value="Private">Private</option>
            <option value="Government">Government</option>
            <option value="Partnership">Partnership</option>
          </select>
        </div>

        {/* Nature of Work */}
        <div className="col-span-2">
          <label className="block text-sm mb-1">Nature of Work</label>
          <textarea
            {...register("nature_of_work")}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        {/* Production Capacity */}
        <div>
          <label className="block text-sm mb-1">Production Capacity</label>
          <input
            type="number"
            {...register("production_capacity")}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        {/* Working Hours */}
        <div>
          <label className="block text-sm mb-1">Working Hours</label>
          <input
            type="number"
            {...register("working_hours")}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        {/* Shifts (Radio) */}
        <div className="col-span-2">
          <label className="block text-sm mb-2">Shifts</label>

          <div className="flex gap-6">
            <label>
              <input
                type="radio"
                value="1"
                {...register("shifts")}
              /> 1
            </label>

            <label>
              <input
                type="radio"
                value="2"
                {...register("shifts")}
              /> 2
            </label>

            <label>
              <input
                type="radio"
                value="3"
                {...register("shifts")}
              /> 3
            </label>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FactoryInfoForm;