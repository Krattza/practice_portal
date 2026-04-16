import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { loginSchema, registerSchema, verifySchema } from "../validators/userValidators.js";
import { email, z } from "zod";
import { register, loginService, verifyUserService } from "../services/userService.js";
import bcrypt from "bcrypt";
import db from "../config/db.js";
import { parse } from "dotenv";
import crypto from "crypto";
import { randomUUID } from "crypto";

import { hashToken, generateSessionToken } from "../utils/session.js";
import { createECDH } from "crypto";

export async function registerUser(req, res) {
  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      const flattened = JSON.parse(parsed.error.message);

      return res.status(400).send(flattened.map((item) => item.message));

    }

    const data = parsed.data;

    const result = await register(data);

    return res.status(201).json({
      message: "Registration successful. Please verify your email.",
      userId: result.userId,
      email: result.email
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
}

export async function verifyUser(req, res) {
  try {
    const parsed = verifySchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.issues.map((i) => i.message),
      });
    }

    const data = parsed.data;

    const result = await verifyUserService(data);

    return res.status(200).json({
      message: "OTP verified successfully",
      role: result.role
    });

  } catch (err) {
    return res.status(err.statusCode || 400).json({
      error: err.message
    });
  }
}

export async function loginUser(req, res) {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      const flattened = JSON.parse(parsed.error.message);
      return res.status(400).send(flattened.map((e) => e.message));
    }

    const data = parsed.data;

    const result = await loginService(data, req);

    // Set cookie here (controller responsibility)
    res.cookie("session_token", result.token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      expires: result.expiresAt
    });

    // Give access token
    res.cookie('access_token', result.accessToken, { 
    maxAge: 900000, // 1 hour
    httpOnly: true,
    secure: false,
    sameSite: "Lax"
  });

    // give refresh token
    res.cookie('refresh_token', result.refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      httpOnly: true,
      secure: false,
      sameSite: "Lax"
    })

    return res.status(200).json({
      message: "Login successful",
      role: result.role
    });

  } catch (err) {
    return res.status(err.statusCode || 400).json({
      error: err.message
    });
  }
}
export async function getCurrentUser(req, res) {
  
}
// export async function verifyUser(req, res) {
//   // It has post method so it post data like otp ad all
//   // grab it from req.body
//   // make a query that gets hashed otp and userId from database

//   // Compare the hashed otp from there

//   const result = verifySchema.safeParse(req.body);

//   if (!result.success) {
//     console.log();
//     return res.status(400).json({
//       error: result.error.issues.map((item) => item.message),
//     });
//   }
//   // handled if result has errors

//   // now if successed
  
//   const { otp, email } = result.data;

//   // NOw get userId from emailId
//   const dbResponse = db
//     .prepare("SELECT id, role FROM users WHERE email=?")
//     .get(email);
  
  

//   if (!dbResponse) {
//     return res.status(404).json({ error: "User not found" });
//   }

//   const userId = dbResponse.id;
//   const role = dbResponse.role
//   // Now from userid get the hashed token
//   const otpResult = db
//     .prepare("Select otp_hash FROM email_verifications WHERE user_id=?")
//     .get(userId);

//   if (!otpResult) {
//     return res.status(400).send("No OTP found, Try Again");
//   }

//   const hashedOtp = otpResult.otp_hash;

//   // use run for update, insert or delete queries

//   // can save result in destructered objects using as keyword

//   // compared hashOtp to the otp user provided
//   const hashResult = await bcrypt.compare(otp, hashedOtp);

//   console.log(hashResult);

//   if (!hashResult) {
//     // Increment attempts count safely
//     const updateResult = db
//       .prepare(
//         `
//     UPDATE email_verifications 
//     SET attempts = attempts + 1 
//     WHERE user_id = ?
//   `,
//       )
//       .run(userId);

//     console.log("Attempts updated:", updateResult); // { changes: 1, lastInsertRowid: 0 }

//     // Optional: Check how many attempts have been made now

//     const currentOtp = db
//       .prepare(
//         `
//     SELECT attempts, expires_at 
//     FROM email_verifications 
//     WHERE user_id = ?
//   `,
//       )
//       .get(userId);
//     //  as { attempts: number; expires_at: string } | undefined;
//     const { attempts, expires_at } = currentOtp;

//     if (currentOtp && currentOtp.attempts >= 3) {
//       // Example: max 3 attempts

//       db.prepare(
//         `UPDATE users SET locked_until=datetime('now', '+1 day') WHERE id=?`,
//       ).run(userId);

//       return res.status(429).json({
//         success: false,
//         error: "Too many incorrect attempts. Please request a new OTP.",
//         lockedUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
//       });
//     }

//     return res.status(400).json({
//       success: false,
//       error: "Incorrect OTP",
//       attemptsLeft: Math.max(0, 3 - attempts),
//     });
//   }

//   // update is_verified here
//   db.prepare(`
//   UPDATE users 
//   SET is_verified = 1 
//   WHERE email = ?
// `).run(email.toLowerCase().trim());

//   if (role === 'department') {

//     const dept_id = randomUUID()
//     const department_id =  101
//     const dept_role = 'operations'
//     // Now prepare an entry query to enter data in department_staff
//     try {
//       db.prepare(`INSERT INTO department_staff (
//         id, user_id, department_id, role
//       ) VALUES (?, ?, ?, ?)`).run(
//         dept_id,
//         userId,
//         department_id,
//         dept_role
//       )
//     } catch(e) {
//       console.log(e)
//     }
//   }

//   if (role === 'citizen') {
//     const citizen_id = randomUUID()
//     const occupation = 'FACTORY OWNER'
//     const annual_income = 'above 10 lakh'
//     const profile_status = 'complete'
    
//     try {
//       db.prepare(`INSERT INTO citizens (id, user_id, occupation, annual_income, profile_status) VALUES(?, ?, ?, ?, ?)`)
//     .run(citizen_id, userId, occupation, annual_income, profile_status)
//     } catch(e) {
//       console.log(e)
//     }
//   }
//   return res.status(200).send("OTP verified.");
// }

// Now connect it to nodemailer





// Abstract the below functionlity in lie logijn usr and loginServices

// export async function login(req, res) {

//   // results from req.boy
//   const results = loginSchema.safeParse(req.body)
//   // console.log(relt);
//   const email = results.data.email
//   const password = results.data.password

//   // Should check if the acoiunt is already locked if it is should not permit for login
//   // const lockedResp = db.prepare('SELECT locked_until FROM')
//   // console.log(password, email)
//   // Services for password like checking

//   // Take userid
//   // login first check if they are verifid
   
  
//   const userData = db.prepare('SELECT id, role, password_hash, is_verified FROM users WHERE email=?').get(email)

//   const userId = userData.id
//   const role = userData.role
//   const hashedPassword = userData.password_hash

//   const is_verified = userData.is_verified
  
//   // Check if verified

//   if(is_verified === 0) {
    
//     //logEvent({ userId, action, status, metadata, req, sessionId = null })
//     logEvent({
//       userId: userId,
//       action: 'LOGIN',
//       status: 'FAILED',
//       entity: 'users',
//       entity_id: userId,
//       metadata: {reason: "email_not_verified"},
//       req
//     })

//     return res.status(401).send('Authorization Denied, Email Not Verified')
    
//   }

//   const match = await bcrypt.compare(password,hashedPassword)

//   if(!match) {

//     db.prepare(`
//     UPDATE users
//     SET failed_login_attempts = failed_login_attempts + 1
//     WHERE email = ?
//   `).run(email);

//   const resultAttemps = db.prepare(`
//     SELECT failed_login_attempts FROM users WHERE email = ?
//   `).get(email);


//   const loginAttempts = resultAttemps.failed_login_attempts
  

//   if (loginAttempts >= 3) {
    
//     db.prepare(`
//       UPDATE users
//       SET locked_until = datetime('now', '+24 hours'),
//           failed_login_attempts = 0
//       WHERE email = ?
//     `).run(email);

//     return res.status(403).json({
//       message: "Too many failed attempts. Account locked for 24 hours."
//     });
//   }

//   logEvent({
//       userId: userId,
//       action: 'LOGIN',
//       status: 'FAILED',
//       entity: 'users',
//       entity_id: userId,
//       metadata: {reason: "Incorrect Password"},
//       req
//     })

//   return res.status(401).send('Incorrect Password, Try Again later')
    
//   }

  
//   const {token, expiresAt} = await createSession(userId, req)

//   // console.log(token)
//   // console.log(expiresAt)

//   res.cookie("session_token", token, {
//     httpOnly: true,
//     secure: false, 
//     sameSite: "strict",
//     expires: expiresAt
//   });

  
//   logEvent({
//       userId: userId,
//       action: 'LOGIN',
//       status: 'SUCCESS',
//       entity: 'users',
//       entity_id: userId,
//       // metadata: {reason: "Successful Login"},
//       req,
//       sessionId: token
//     })

//   return res.status(200).json({
//     message: "Login successful",
//     role: role
//   })

//   // return res.status(200).send('User Verified')

// }


// Todos in Login

  // if verified create a session and pt it in a cookie


  // react div eventcard componrnt axios.get fetch await

  // here in this componet inside useEffect() run an cxios get request that gets all all the post from my database here

  // is the url for my localhost:- [provide the route here (http:localhost:8500/api/users/), the url is icomplete i dont know your endpints] 

  // get the data and put it in a posts state.

  // 11- 11:30 