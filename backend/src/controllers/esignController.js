import bcrypt from "bcrypt";
// import { success } from 'zod';
import { getPool } from "../config/db2.js";
import sql from "mssql";
export async function sendESignOTP(req, res) {
  try {
    const { application_id, user_id, email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    console.log("OTP:", otp);

    // hash and conection

    const otpHash = await bcrypt.hash(otp, 10);

    console.log(otpHash);
    const pool = getPool();
    const request = pool.request();
    const expires_at = new Date(Date.now() + 5 * 60 * 1000);

    request.input("application_id", sql.Int, application_id);
    request.input("user_id", sql.VarChar(36), user_id);
    request.input("email", sql.VarChar(100), email);
    request.input("otp_hash", sql.NVarChar(255), otpHash);
    request.input("expires_at", sql.DateTime2, expires_at.toISOString());

    await request.query(`
    INSERT INTO factorysync.dbo.esign_otp_verifications (
      application_id, user_id, email, otp_hash, expires_at
    )
    VALUES (
      @application_id, @user_id, @email, @otp_hash, @expires_at
    )
  `);

    return res.status(200).json({ success: true });
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export async function verifyESignOTP(req, res) {
  const { application_id, otp } = req.body;

  const pool = getPool();
  const request = pool.request();

  request.input("application_id", sql.Int, application_id);

  const result = await request.query(`
    SELECT TOP 1 * 
    FROM factorysync.dbo.esign_otp_verifications
    WHERE application_id = @application_id
    ORDER BY created_at DESC
  `);

  if (!result.recordset.length) {
    return res.status(400).json({ error: "No OTP found" });
  }

  const record = result.recordset[0];

  // expired
  if (new Date() > record.expires_at) {
    return res.status(400).json({ error: "OTP expired" });
  }

  const isMatch = await bcrypt.compare(otp, record.otp_hash);

  if (!isMatch) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  // mark verified
  await pool
    .request()
    .input("id", sql.Int, record.id)
    .query(`UPDATE factorysync.dbo.esign_otp_verifications SET is_verified = 1 WHERE id = @id`);

  // 🔥 Signature block
  const signature = `
Digitally Signed by Pikachu Square
Date: ${new Date().toLocaleString()}
Application ID: ${application_id}
Reason: Factory Registration Approval
Location: India
  `;

  // TODO: generate PDF here and attach signature

  return res.json({
    success: true,
    signature,
  });
}
