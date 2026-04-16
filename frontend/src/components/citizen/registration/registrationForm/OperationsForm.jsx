import React from "react";

const OperationsForm = ({ register }) => {
  return (
    <div className="bg-white shadow-sm rounded-xl p-8">
      <h2 className="text-xl font-semibold mb-6">Operations</h2>

      <div className="grid grid-cols-2 gap-6">

        <input placeholder="Industry Type" {...register("industry_type")} className="input" />

        <div>
          <label>Hazardous Process</label>
          <select {...register("hazardous_process")} className="input">
            <option value="">Select</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        <textarea
          placeholder="Hazard Description"
          {...register("hazard_description")}
          className="input col-span-2"
        />

        <input type="number" placeholder="Power Load" {...register("power_load")} className="input" />

        <input type="number" placeholder="Machinery Count" {...register("machinery_count")} className="input" />

        <div>
          <label>Boiler Installed</label>
          <select {...register("boiler_installed")} className="input">
            <option value="">Select</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        <input placeholder="Boiler Type" {...register("boiler_type")} className="input" />

      </div>
    </div>
  );
};

export default OperationsForm;