import { email, z } from "zod";

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

export const registerSchema = z
  .object({
    first_name: z
      .string()
      .trim()
      .min(2)
      .max(50)
      .regex(/^[A-Za-z\s]+$/, "Only letters allowed"),

    last_name: z
      .string()
      .trim()
      .max(50)
      .regex(/^[A-Za-z\s]*$/, "Only letters allowed")
      .optional(),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .pipe(z.email({message:"Invalid email format"})),

    password: z
      .string()
      .min(8)
      .max(100)
      .regex(/[A-Z]/)
      .regex(/[a-z]/)
      .regex(/[0-9]/)
      .regex(/[^A-Za-z0-9]/),

    confirm_password: z.string(),

    mobile_number: z
      .string()
      .trim()
      .regex(/^[0-9]{10}$/),

    date_of_birth: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .refine(isAdult, "User must be at least 18"),
    role: z.enum(['citizen', 'department', 'super_admin']),
    state: z.string().trim().min(2),
    district: z.string().trim().min(2),

    house_number: z.string().max(20).optional(),
    street: z.string().max(100).optional(),
    landmark: z.string().max(100).optional(),

    pincode: z
      .string()
      .trim()
      .regex(/^[0-9]{6}$/),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });


export const loginSchema = z.object(
  {
    email: z.string().trim().lowercase().pipe(z.email({message: "Invalid Email format"})),
    password: z.string().trim().min(8)
  }
)

export const verifySchema = z.object({
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP must be exactly 6 digits"),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email({message:"Invalid email format"})),
});