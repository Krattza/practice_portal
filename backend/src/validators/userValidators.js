import { z } from "zod";

// helper: age check
const isAdult = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= 18;
};

export const registerSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .max(100, "Full name too long")
    .refine(val => !/^\d+$/.test(val), "Name cannot be only numbers"),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email({ message: "Invalid email format"})),

     
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[a-z]/, "Must contain lowercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^A-Za-z0-9]/, "Must contain special character"),

  confirm_password: z.string(),

  mobile_number: z
    .string()
    .regex(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),

  date_of_birth: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format")
    .refine(isAdult, "User must be at least 18 years old"),

  state: z.string().min(2, "State is required"),
  district: z.string().min(2, "District is required"),

  address: z
    .string()
    .min(10, "Address too short")
    .max(500, "Address too long"),

  pincode: z
    .string()
    .regex(/^[0-9]{6}$/, "Pincode must be 6 digits")
})
.refine(data => data.password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"]
});