import React from "react";

const WorkersForm = ({ register }) => {
  return (
    <div className="bg-white shadow-sm rounded-xl p-8">
      <h2 className="text-xl font-semibold mb-6">Workers</h2>

      <div className="grid grid-cols-2 gap-6">

        <input type="number" placeholder="Male Workers" {...register("male_workers")} className="input" />
        <input type="number" placeholder="Female Workers" {...register("female_workers")} className="input" />

        <input type="number" placeholder="Contract Workers" {...register("contract_workers")} className="input" />
        <input type="number" placeholder="Supervisors" {...register("supervisors")} className="input" />

        <div className="col-span-2">
          <label>Safety Officer Available</label>
          <select {...register("safety_officer")} className="input">
            <option value="">Select</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

      </div>
    </div>
  );
};

export default WorkersForm;