// validation/registrationSchema.js

import { z } from "zod";

export const registrationSchema = z.object({
  // STEP 1: Factory Info
  user_id: z.string().optional(),
  factory_name: z.string().min(1, "Factory name is required"),

  factory_address: z.string().optional(),

  factory_pincode: z
    .string()
    .regex(/^\d{6}$/, "Pincode must be 6 digits")
    .optional(),

  factory_email: z
    .string()
    .pipe(z.email({ message: "Invalid email" }))
    .optional(),

  factory_phone: z
    .string()
    .regex(/^\d{10}$/, "Phone must be 10 digits")
    .optional(),

  factory_type: z.string().optional(),

  nature_of_work: z.string().optional(),

  production_capacity: z.coerce.number().optional(),

  working_hours: z.coerce.number().optional(),

  shifts: z.coerce.number().optional(),

  // // STEP 2: Owner Details
  owner_name: z.string().optional(),

  owner_email: z
    .string()
    .pipe(z.email({ message: "Invalid owner email" }))
    .optional(),

  owner_mobile: z
    .string()
    .regex(/^\d{10}$/, "Mobile must be 10 digits")
    .optional(),

  owner_aadhar: z
    .string()
    .regex(/^\d{12}$/, "Aadhar must be 12 digits")
    .optional(),

  owner_pan: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format")
    .optional(),

  // owner_dob: z.string().optional(),

  owner_gender: z.enum(["Male", "Female"]).optional(),

  // STEP 3: Operations
  industry_type: z.string().optional(),

  hazardous_process: z.coerce.boolean().optional(),

  hazard_description: z.string().optional(),

  power_load: z.coerce.number().optional(),

  machinery_count: z.coerce.number().optional(),

  boiler_installed: z.coerce.boolean().optional(),

  boiler_type: z.string().optional(),

  // STEP 4: Workers
  male_workers: z.coerce.number().optional(),

  female_workers: z.coerce.number().optional(),

  contract_workers: z.coerce.number().optional(),

  supervisors: z.coerce.number().optional(),

  safety_officer: z.coerce.boolean().optional(),

  // STEP 5: Documents (will be file paths later)
  aadhar_doc: z.string().optional(),
  pan_doc: z.string().optional(),

  // // STEP 6: Declaration
  // declaration_accepted: z.coerce.boolean().optional(),

  // digital_signature: z.string().optional(),
});
