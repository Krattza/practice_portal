// Services are there for bussiness logics

// What kind of bussiness logics shall be hanled?

// Validating passwords, age checks, hasing password, generating otp and hashing otp

// Storing stuffs on database


import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import db from '../config/db.js';

export const register = async (data) => {
  const {
    full_name,
    email,
    password,
    confirm_password,
    mobile_number,
    date_of_birth,
    state,
    district,
    address,
    pincode
  } = data;


  if (password !== confirm_password) {
    throw new Error("Passwords do not match");
  }


  // CHeck the age
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
    db.prepare(`
      INSERT INTO users (
        id, full_name, email, password_hash,
        mobile_number, date_of_birth,
        state, district, address, pincode
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      full_name.trim(),
      email.toLowerCase(),
      password_hash,
      mobile_number,
      date_of_birth,
      state,
      district,
      address,
      pincode
    );

  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      throw new Error("Email or mobile already exists");
    }
    throw err;
  }

  
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const otp_hash = await bcrypt.hash(otp, 10);

  const expires_at = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  // 7. Store OTP
  db.prepare(`
    INSERT INTO email_verifications (id, user_id, otp_hash, expires_at)
    VALUES (?, ?, ?, ?)
  `).run(randomUUID(), userId, otp_hash, expires_at);

  // 8. Send email (stub for now)

  // Now build email verification
  console.log("OTP:", otp);

  return { userId };
};