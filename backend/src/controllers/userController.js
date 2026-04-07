import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { registerSchema } from "../validators/userValidators.js";

import { register } from "../services/userService.js";

export async function registerUser(req, res) {

  try {

    const parsed = registerSchema.safeParse(req.body)
    
    if(!parsed.success) {
        return res.status(400).send("Inputs field not in correct format")
    }
    const data = parsed.data 

    const result = await register(data);

    return res.status(201).json({
      message: "Registration successful. Please verify your email.",
      userId: result.userId,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}
