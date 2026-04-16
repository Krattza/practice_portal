// Services are there for bussiness logics
// What kind of bussiness logics shall be hanled?
// Validating passwords, age checks, hasing password, generating otp and hashing otp
// Storing stuffs on database

import sql from "mssql";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import db from "../config/db.js";
// import { sendMail } from "../config/mail.js";
import { createSession } from "../utils/session.js";
import { logEvent } from "../utils/logger.js";
import { getPool } from "../config/db2.js";

export const register = async (data) => {
  const pool = getPool();
  const {
    first_name,
    last_name,
    email,
    password,
    confirm_password,
    mobile_number,
    date_of_birth,
    role,
    state,
    district,
    house_number,
    street,
    landmark,
    pincode,
  } = data;

  if (password !== confirm_password) {
    throw new Error("Passwords do not match");
  }

  // Check the age
  // Substract the age's birtj year from full year
  const dob = new Date(date_of_birth);
  const age = new Date().getFullYear() - dob.getFullYear();
  if (age < 18) {
    throw new Error("User must be at least 18");
  }

  // Hash tje password
  const password_hash = await bcrypt.hash(password, 12);


  try {
  

    const request = pool.request();

    request.input("first_name", first_name.trim());
    request.input("last_name", last_name.trim());
    request.input("email", email.toLowerCase());
    request.input("password_hash", password_hash.trim());
    request.input("mobile_number", mobile_number.trim());
    request.input("date_of_birth", date_of_birth);
    request.input("role", role.trim());
    request.input("state", state);
    request.input("district", district.trim());
    request.input("house_number", house_number.trim());
    request.input("street", street.trim());
    request.input("landmark", landmark.trim());
    request.input("pincode", pincode.trim());

    await request.query(
      `
        INSERT INTO factorysync.dbo.users (
        first_name, 
        last_name,
         email, 
         password_hash,
          mobile_number,
          date_of_birth, 
           role,
           state,
          district, 
          house_number, 
          street, 
          landmark,
           pincode) VALUES (@first_name, @last_name, @email, @password_hash, @mobile_number, @date_of_birth, @role, @state, @district, @house_number, @street, @landmark, @pincode)
      `,
    );
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      throw new Error("Email or mobile already exists");
    }
    throw err;
  }

  const userResult = await pool.request().input("email", email.toLowerCase())
    .query(`
    SELECT id FROM factorysync.dbo.users WHERE email = @email
  `);

  console.log(userResult);

  const userId = userResult.recordset[0].id;

  console.log(userId);

  // After gtting inserted into uset insert it into citizen and department based on role

  // const roleResponse = db.prepare("SELECT role FROM users WHERE email=?").get(email.toLowerCase())

  // make seperate function for registerDepartment and registerCitizen

  // Prepare OTP and hash and save it in email verifications
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const otp_hash = await bcrypt.hash(otp, 10);

  const expires_at = new Date(Date.now() + 15 * 60 * 1000);

  console.log(userId);
  console.log(otp_hash);
  console.log(expires_at);

  const emailRequest = pool.request();

  emailRequest.input("user_id", sql.Int, Number(userId));
  emailRequest.input("otp_hash", sql.NVarChar(255), otp_hash);
  emailRequest.input("expires_at", sql.DateTime2, expires_at.toISOString());

  await emailRequest.query(`
  INSERT INTO factorysync.dbo.email_verifications (
    user_id,
    otp_hash,
    expires_at
  )
  VALUES (
    @user_id,
    @otp_hash,
    @expires_at
  )
`);
  // 7. Store OTP
  // db.prepare(
  //   `
  //   INSERT INTO email_verifications (id, user_id, otp_hash, expires_at)
  //   VALUES (?, ?, ?, ?)
  // `,
  // ).run(randomUUID(), userId, otp_hash, expires_at);

  // inside this register function we have to call for
  // 8. Send email (stub for now)

  // sendMail(email.toLowerCase(), otp)
  // Now build email verification

  //  verifyUser(userId, otp)
  console.log({
    otp: otp,
    email: email.toLowerCase(),
  });
  return { userId, email };
};

// export const verifyUserService = async (data) => {
//   const { otp, email } = data;

//   const user = db
//     .prepare(`SELECT id, role FROM users WHERE email=?`)
//     .get(email);

//   if (!user) {
//     throw { message: "User not found", statusCode: 404 };
//   }

//   const { id: userId, role } = user;

//   const otpData = db
//     .prepare(
//       `
//       SELECT otp_hash, attempts, expires_at
//       FROM email_verifications
//       WHERE user_id = ?
//     `,
//     )
//     .get(userId);

//   if (!otpData) {
//     throw { message: "No OTP found", statusCode: 400 };
//   }

//   const { otp_hash, attempts, expires_at } = otpData;

//   if (new Date(expires_at) < new Date()) {
//     throw { message: "OTP expired", statusCode: 400 };
//   }

//   const isMatch = await bcrypt.compare(otp, otp_hash);

//   if (!isMatch) {
//     const newAttempts = attempts + 1;

//     // Lock after 3 attempts
//     if (newAttempts >= 3) {
//       db.prepare(
//         `
//         UPDATE users
//         SET locked_until = datetime('now', '+24 hours')
//         WHERE id = ?
//       `,
//       ).run(userId);

//       db.prepare(
//         `
//         UPDATE email_verifications
//         SET attempts = 0
//         WHERE user_id = ?
//       `,
//       ).run(userId);

//       throw {
//         message: "Too many incorrect attempts. Account locked.",
//         statusCode: 429,
//       };
//     }

//     db.prepare(
//       `
//       UPDATE email_verifications
//       SET attempts = ?
//       WHERE user_id = ?
//     `,
//     ).run(newAttempts, userId);

//     throw {
//       message: "Incorrect OTP",
//       statusCode: 400,
//     };
//   }

//   db.prepare(
//     `
//     UPDATE users
//     SET is_verified = 1
//     WHERE id = ?
//   `,
//   ).run(userId);

//   if (role === "department") {
//     db.prepare(
//       `
//       INSERT INTO department_staff (id, user_id, department_id, role)
//       VALUES (?, ?, ?, ?)
//     `,
//     ).run(randomUUID(), userId, 101, "operations");
//   }

//   if (role === "citizen") {
//     db.prepare(
//       `
//       INSERT INTO citizens (id, user_id, occupation, annual_income, profile_status)
//       VALUES (?, ?, ?, ?, ?)
//     `,
//     ).run(randomUUID(), userId, "FACTORY OWNER", "above 10 lakh", "complete");
//   }

//   db.prepare(
//     `
//     DELETE FROM email_verifications WHERE user_id = ?
//   `,
//   ).run(userId);

//   return { role };
// };

export const verifyUserService = async (data) => {
  const { otp, email } = data;

  // 🔹 Get user
  const userResult = await pool.request()
    .input('email', sql.NVarChar, email)
    .query(`
      SELECT id, role FROM users WHERE email = @email
    `);

  const user = userResult.recordset[0];
      
  console.log(user)

  if (!user) {
    throw { message: "User not found", statusCode: 404 };
  }

  const { id: userId, role } = user;

  // 🔹 Get OTP data
  const otpResult = await pool.request()
    .input('user_id', sql.Int, userId)
    .query(`
      SELECT otp_hash, attempts, expires_at
      FROM email_verifications
      WHERE user_id = @user_id
    `);

  const otpData = otpResult.recordset[0];
      console.log(otpData)
  if (!otpData) {
    throw { message: "No OTP found", statusCode: 400 };
  }

  const { otp_hash, attempts, expires_at } = otpData;

  // 🔹 Expiry check
  if (new Date(expires_at) < new Date()) {
    throw { message: "OTP expired", statusCode: 400 };
  }

  const isMatch = await bcrypt.compare(otp, otp_hash);

  if (!isMatch) {
    const newAttempts = attempts + 1;

    if (newAttempts >= 3) {
      // 🔥 Lock user (MSSQL way)
      await pool.request()
        .input('user_id', sql.Int, userId)
        .query(`
          UPDATE users
          SET locked_until = DATEADD(HOUR, 24, SYSUTCDATETIME())
          WHERE id = @user_id
        `);

      await pool.request()
        .input('user_id', sql.Int, userId)
        .query(`
          UPDATE email_verifications
          SET attempts = 0
          WHERE user_id = @user_id
        `);

      throw {
        message: "Too many incorrect attempts. Account locked.",
        statusCode: 429,
      };
    }

    await pool.request()
      .input('attempts', sql.Int, newAttempts)
      .input('user_id', sql.Int, userId)
      .query(`
        UPDATE email_verifications
        SET attempts = @attempts
        WHERE user_id = @user_id
      `);

    throw {
      message: "Incorrect OTP",
      statusCode: 400,
    };
  }

  await pool.request()
    .input('user_id', sql.Int, userId)
    .query(`
      UPDATE users
      SET is_verified = 1
      WHERE id = @user_id
    `);

  // // 🔹 Role-based inserts
  // if (role === "department") {
  //   await pool.request()
  //     .input('id', sql.UniqueIdentifier, randomUUID())
  //     .input('user_id', sql.Int, userId)
  //     .input('department_id', sql.Int, 101)
  //     .input('role', sql.NVarChar, "operations")
  //     .query(`
  //       INSERT INTO department_staff (id, user_id, department_id, role)
  //       VALUES (@id, @user_id, @department_id, @role)
  //     `);
  // }

  // if (role === "citizen") {
  //   await pool.request()
  //     .input('id', sql.UniqueIdentifier, randomUUID())
  //     .input('user_id', sql.Int, userId)
  //     .input('occupation', sql.NVarChar, "FACTORY OWNER")
  //     .input('annual_income', sql.NVarChar, "above 10 lakh")
  //     .input('profile_status', sql.NVarChar, "complete")
  //     .query(`
  //       INSERT INTO citizens (id, user_id, occupation, annual_income, profile_status)
  //       VALUES (@id, @user_id, @occupation, @annual_income, @profile_status)
  //     `);
  // }

  // 🔹 Delete OTP
  await pool.request()
    .input('user_id', sql.Int, userId)
    .query(`
      DELETE FROM email_verifications WHERE user_id = @user_id
    `);

  return { role };
};

export const loginService = async (data, req) => {
  const { email, password } = data;

  const userData = db
    .prepare(
      `
    SELECT id, role, password_hash, is_verified, failed_login_attempts, locked_until
    FROM users
    WHERE email = ?
  `,
    )
    .get(email);

  if (!userData) {
    throw { message: "User not found", statusCode: 404 };
  }

  const {
    id: userId,
    role,
    password_hash,
    is_verified,
    failed_login_attempts,
    locked_until,
  } = userData;

  if (locked_until && new Date(locked_until) > new Date()) {
    throw {
      message: "Account is locked. Try again later.",
      statusCode: 403,
    };
  }

  if (is_verified === 0) {
    logEvent({
      userId,
      action: "LOGIN",
      status: "FAILED",
      entity: "users",
      entity_id: userId,
      metadata: { reason: "email_not_verified" },
      req,
    });

    throw {
      message: "Email not verified",
      statusCode: 401,
    };
  }

  const match = await bcrypt.compare(password, password_hash);

  if (!match) {
    const attempts = failed_login_attempts + 1;

    if (attempts >= 3) {
      // db.pre

      throw {
        message: "Too many attempts. Account locked for 24 hours.",
        statusCode: 403,
      };
    }

    db.prepare(
      `
      UPDATE users
      SET failed_login_attempts = ?
      WHERE id = ?
    `,
    ).run(attempts, userId);
pare(
        `
        UPDATE users
        SET failed_login_attempts = 0,
            locked_until = datetime('now', '+24 hours')
        WHERE id = ?
      `,
      ).run(userId);
    logEvent({
      userId,
      action: "LOGIN",
      status: "FAILED",
      entity: "users",
      entity_id: userId,
      metadata: { reason: "incorrect_password" },
      req,
    });

    throw {
      message: "Incorrect password",
      statusCode: 401,
    };
  }

  db.prepare(
    `
    UPDATE users
    SET failed_login_attempts = 0,
        locked_until = NULL
    WHERE id = ?
  `,
  ).run(userId);

  const { token, expiresAt } = await createSession(userId, req);

  const accessToken = generateAccessToken(userData);
  const refreshToken = generateRefreshToken(userData);

  logEvent({
    userId,
    action: "LOGIN",
    status: "SUCCESS",
    entity: "users",
    entity_id: userId,
    req,
    sessionId: token,
  });

  return {
    token,
    expiresAt,
    role,
    accessToken,
    refreshToken,
  };
};

// db.prepare(
//   `
//   INSERT INTO users (
//     id, first_name, last_name, email, password_hash,
//     mobile_number, date_of_birth, role,
//     state, district, house_number, street, landmark, pincode
//   ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
// `,
// ).run(
//   userId,
//   first_name.trim(),
//   last_name.trim(),
//   email.toLowerCase(),
//   password_hash,
//   mobile_number,
//   date_of_birth,
//   role,
//   state,
//   district,
//   house_number,
//   street,
//   landmark,
//   pincode,
// );

// export const register = async (data) => {
//   const pool = getPool();
//   const {
//     first_name,
//     last_name,
//     email,
//     password,
//     confirm_password,
//     mobile_number,
//     date_of_birth,
//     role,
//     state,
//     district,
//     house_number,
//     street,
//     landmark,
//     pincode,
//   } = data;

//   if (password !== confirm_password) {
//     throw new Error("Passwords do not match");
//   }

//   // Check the age
//   // Substract the age's birtj year from full year
//   const dob = new Date(date_of_birth);
//   const age = new Date().getFullYear() - dob.getFullYear();
//   if (age < 18) {
//     throw new Error("User must be at least 18");
//   }

//   // Hash tje password
//   const password_hash = await bcrypt.hash(password, 12);

//   try {

//     const request = pool.request();

//     request.input("first_name", first_name.trim());
//     request.input("last_name", last_name.trim());
//     request.input("email", email.toLowerCase());
//     request.input("password_hash", password_hash.trim());
//     request.input("mobile_number", mobile_number.trim());
//     request.input("date_of_birth", date_of_birth.trim());
//     request.input("role", role.trim());
//     request.input("state", state);
//     request.input("district", district.trim());
//     request.input("house_number", house_number.trim());
//     request.input("street", street.trim());
//     request.input("landmark", landmark.trim());
//     request.input("pincode", pincode.trim());

//     await request.query(
//       `
//         INSERT INTO factorysync.dbo.users (
//         first_name,
//         last_name,
//          email,
//          password_hash,
//           mobile_number,
//           date_of_birth,
//            role,
//            state,
//           district,
//           house_number,
//           street,
//           landmark,
//            pincode) VALUES (@first_name, @last_name, @email, @password_hash, @mobile_number, @date_of_birth, @role, @state, @district, @house_number, @street, @landmark, @pincode)
//       `,
//     );
//   } catch (err) {
//     if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
//       throw new Error("Email or mobile already exists");
//     }
//     throw err;
//   }

//   const userResult = await pool.request().input("email", email.toLowerCase())
//     .query(`
//     SELECT id FROM factorysync.dbo.users WHERE email = @email
//   `);

//   console.log(userResult);

//   const userId = userResult.recordset[0].id;

//   console.log(userId);

//   const otp = Math.floor(100000 + Math.random() * 900000).toString();

//   const otp_hash = await bcrypt.hash(otp, 10);

//   const expires_at = new Date(Date.now() + 15 * 60 * 1000);

//   console.log(userId);
//   console.log(otp_hash)
//   console.log(expires_at);

//   const emailRequest = pool.request();

// emailRequest.input("user_id", sql.Int, Number(userId));
// emailRequest.input("otp_hash", sql.NVarChar(255), otp_hash);
// emailRequest.input("expires_at", sql.DateTime, new Date(expires_at));

// await emailRequest.query(`
//   INSERT INTO factorysync.dbo.email_verifications (
//     user_id,
//     otp_hash,
//     expires_at
//   )
//   VALUES (
//     @user_id,
//     @otp_hash,
//     @expires_at
//   )
// `);

//   console.log({
//     otp: otp,
//     email: email.toLowerCase(),
//   });
//   return { userId, email };
// };
