import { useForm } from "react-hook-form";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

const Register = ({setEmail}) => {
  const {
    register,
    handleSubmit,
    watch,
  } = useForm();

  const navigate = useNavigate()
  const password = watch("password");

 const onSubmit = async (data) => {
  try {
   
    const response = await axios.post(
      "http://localhost:8500/api/users/register",
      data
    );
    
    console.log("API SUCCESS:", response);

    setEmail(response.data.email);
    console.log("Email set");

    navigate("/verify-otp", { state: { email: response.data.email } });
    console.log("Navigated");

  } catch (error) {
    const message =
      error.response?.data?.error || "Something went wrong";

    console.log(message);
  }
};

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

        
        <div className="flex gap-2">
          <input
            placeholder="First Name"
            {...register("first_name", { required: true })}
            className="input"
          />
          <input
            placeholder="Last Name"
            {...register("last_name")}
            className="input"
          />
        </div>

      
        <input
          placeholder="Email"
          {...register("email", { required: true })}
          className="input"
        />

        
        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: true })}
          className="input"
        />

       
        <input
          type="password"
          placeholder="Confirm Password"
          {...register("confirm_password", {
            required: true,
            validate: (value) =>
              value === password || "Passwords do not match",
          })}
          className="input"
        />

        <input
          placeholder="Mobile Number"
          {...register("mobile_number", { required: true })}
          className="input"
        />

        <input
          type="date"
          {...register("date_of_birth", { required: true })}
          className="input"
        />

      
        <div>
          <label className="text-sm font-medium">Role:</label>
          <div className="flex gap-4 mt-1 text-sm">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                value="citizen"
                {...register("role", { required: true })}
              />
              Citizen
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                value="department"
                {...register("role", { required: true })}
              />
              Department
            </label>
          </div>
        </div>

       
        <div className="flex gap-2">
          <input
            placeholder="State"
            {...register("state", { required: true })}
            className="input"
          />
          <input
            placeholder="District"
            {...register("district", { required: true })}
            className="input"
          />
        </div>

      
        <input placeholder="House Number" {...register("house_number")} className="input" />
        <input placeholder="Street" {...register("street")} className="input" />
        <input placeholder="Landmark" {...register("landmark")} className="input" />


        <input
          placeholder="Pincode"
          {...register("pincode", { required: true })}
          className="input"
        />

     
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;