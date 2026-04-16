import React from "react";

const DocumentsForm = ({ register, formData }) => {
   const getFileUrl = (path) =>
    path ? `http://localhost:8500${path}` : null;
  return (
    <div className="bg-white shadow-sm rounded-xl p-8">
      <h2 className="text-xl font-semibold mb-6">Documents</h2>

      <div className="grid grid-cols-2 gap-6">

        {/* Aadhar */}
        {!formData?.aadhar_doc && (
          <div className="col-span-2">
          <label className="block text-sm mb-1">Aadhar Document</label>
          <input
            type="file"
            {...register("aadhar_doc")}
            className="input"
          />
        </div>
        ) }

          {formData?.aadhar_doc && (
            <a
              href={getFileUrl(formData.aadhar_doc)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline block mb-2"
            >
              View Uploaded Aadhar
            </a>
          )}

        {/* PAN */}

        {formData?.pan_doc && <div>
          
            <a 
              href={getFileUrl(formData?.pan_doc)}
               target="_blank" 
               rel="noopener noreferrer"
               className="text-blue-600 underline block mb-2">
              View Uploaded Pan
            </a>
          </div>}

          {!formData?.pan_doc && <div className="col-span-2">
          <label className="block text-sm mb-1">PAN Document</label>
          <input
            type="file"
            {...register("pan_doc")}
            className="input"
          />
        </div>}


        

      </div>
    </div>
  );
};

export default DocumentsForm;