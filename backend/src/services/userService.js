// Services are there for bussiness logics
// What kind of bussiness logics shall be hanled?
// Validating passwords, age checks, hasing password, generating otp and hashing otp
// Storing stuffs on database

import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import db from "../config/db.js";
import { sendMail } from "../config/mail.js";

export const register = async (data) => {
  const {
    first_name,
    last_name,
    email,
    password,
    confirm_password,
    mobile_number,
    date_of_birth,
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

  //   User id creation
  const userId = randomUUID();

  //   And then just store stuff in backend
  try {
    db.prepare(
      `
      INSERT INTO users (
        id, first_name, last_name, email, password_hash,
        mobile_number, date_of_birth,
        state, district, house_number, street, landmark, pincode
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    ).run(
      userId,
      first_name.trim(),
      last_name.trim(),
      email.toLowerCase(),
      password_hash,
      mobile_number,
      date_of_birth,
      state,
      district,
      house_number,
      street,
      landmark,
      pincode,
    );
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      throw new Error("Email or mobile already exists");
    }
    throw err;
  }

  // Prepare OTP and hash and save it in email verifications
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const otp_hash = await bcrypt.hash(otp, 10);

  const expires_at = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  // 7. Store OTP
  db.prepare(
    `
    INSERT INTO email_verifications (id, user_id, otp_hash, expires_at)
    VALUES (?, ?, ?, ?)
  `,
  ).run(randomUUID(), userId, otp_hash, expires_at);


  // inside this register function we have to call for 
  // 8. Send email (stub for now)
  console.log({
    otp: otp,
    email: email.toLowerCase(),
  });
  // sendMail(email.toLowerCase(), otp)
  // Now build email verification

  //  verifyUser(userId, otp)
  return { userId };
};

export async function verifyUserService() {
  return ;
}

