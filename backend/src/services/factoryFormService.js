import { getPool } from "../config/db2.js";
import sql from "mssql";

export async function factoryRegisterService(data) {

  try {
    const pool = getPool();
    const checkReq = pool.request();
    checkReq.input("user_id", sql.VarChar(36), data.user_id);

    // After Binding Check if it exists

    const existing = await checkReq.query(`
  SELECT * 
  FROM factorysync.dbo.factory_applications
  WHERE user_id = @user_id
`);

    // phir check if it does exkst well it will if length is greater than 0

    // means there are itemss

    if (existing.recordset.length > 0) {
      const old = existing.recordset[0];

      console.log("EXISTING:", existing.recordset);

      // 🧠 keep old files if new not provided

      const finalData = {
        ...old,
        ...data,
      };

      for (let key in old) {
        finalData[key] =
          data[key] !== undefined && data[key] !== null && data[key] !== ""
            ? data[key]
            : old[key];
      }

      const updateReq = pool.request();

       updateReq.input("user_id", sql.VarChar(36), finalData.user_id);
    updateReq.input("factory_name", sql.VarChar(200), finalData.factory_name);
    updateReq.input("factory_address", sql.VarChar(500), finalData.factory_address);
    updateReq.input("factory_pincode", sql.Char(6), finalData.factory_pincode);
    updateReq.input("factory_email", sql.VarChar(100), finalData.factory_email);
    updateReq.input("factory_phone", sql.VarChar(15), finalData.factory_phone);
    updateReq.input("factory_type", sql.VarChar(50), finalData.factory_type);
    updateReq.input("nature_of_work", sql.VarChar(500), finalData.nature_of_work);
    updateReq.input("production_capacity", sql.Int, finalData.production_capacity);
    updateReq.input("working_hours", sql.Int, finalData.working_hours);
    updateReq.input("shifts", sql.Int, finalData.shifts);

    // STEP 2: Owner Details
    updateReq.input("owner_name", sql.VarChar(100), finalData.owner_name);
    updateReq.input("owner_email", sql.VarChar(100), finalData.owner_email);
    updateReq.input("owner_mobile", sql.VarChar(15), finalData.owner_mobile);
    updateReq.input("owner_aadhar", sql.Char(12), finalData.owner_aadhar);
    updateReq.input("owner_pan", sql.Char(10), finalData.owner_pan);
    // updateReq.input("owner_dob", sql.Date, new Date(finalData.owner_dob));
    updateReq.input("owner_gender", sql.VarChar(10), finalData.owner_gender);

    // // STEP 3: Operations
    updateReq.input("industry_type", sql.VarChar(50), finalData.industry_type);
    updateReq.input("hazardous_process", sql.Bit, finalData.hazardous_process);
    updateReq.input(
      "hazard_description",
      sql.VarChar(500),
      finalData.hazard_description,
    );
    updateReq.input("power_load", sql.Decimal(10, 2), finalData.power_load);
    updateReq.input("machinery_count", sql.Int, finalData.machinery_count);
    updateReq.input("boiler_installed", sql.Bit, finalData.boiler_installed);
    updateReq.input("boiler_type", sql.VarChar(100), finalData.boiler_type);

    // // STEP 4: Workers
    updateReq.input("male_workers", sql.Int, finalData.male_workers);
    updateReq.input("female_workers", sql.Int, finalData.female_workers);
    updateReq.input("contract_workers", sql.Int, finalData.contract_workers);
    updateReq.input("supervisors", sql.Int, finalData.supervisors);
    updateReq.input("safety_officer", sql.Bit, finalData.safety_officer);

    // Step 5 Documents

    updateReq.input("aadhar_doc", sql.VarChar(255), finalData.aadhar_doc);
    updateReq.input("pan_doc", sql.VarChar(255), finalData.pan_doc);

      await updateReq.query(`
      UPDATE factorysync.dbo.factory_applications
SET 
  factory_name = @factory_name,
  factory_address = @factory_address,
  factory_pincode = @factory_pincode,
  factory_email = @factory_email,
  factory_phone = @factory_phone,
  factory_type = @factory_type,
  nature_of_work = @nature_of_work,
  production_capacity = @production_capacity,
  working_hours = @working_hours,
  shifts = @shifts,

  owner_name = @owner_name,
  owner_email = @owner_email,
  owner_mobile = @owner_mobile,
  owner_aadhar = @owner_aadhar,
  owner_pan = @owner_pan,
  owner_gender = @owner_gender,

  industry_type = @industry_type,
  hazardous_process = @hazardous_process,
  hazard_description = @hazard_description,
  power_load = @power_load,
  machinery_count = @machinery_count,
  boiler_installed = @boiler_installed,
  boiler_type = @boiler_type,

  male_workers = @male_workers,
  female_workers = @female_workers,
  contract_workers = @contract_workers,
  supervisors = @supervisors,
  safety_officer = @safety_officer,

  aadhar_doc = @aadhar_doc,
  pan_doc = @pan_doc,

  updated_at = GETDATE()

WHERE user_id = @user_id
    `);

      return old.application_id; // return existing application id
    }

    const insertReq = pool.request()

    // STEP 1: Factory Info
    insertReq.input("user_id", sql.VarChar(36), data.user_id);
    insertReq.input("factory_name", sql.VarChar(200), data.factory_name);
    insertReq.input("factory_address", sql.VarChar(500), data.factory_address);
    insertReq.input("factory_pincode", sql.Char(6), data.factory_pincode);
    insertReq.input("factory_email", sql.VarChar(100), data.factory_email);
    insertReq.input("factory_phone", sql.VarChar(15), data.factory_phone);
    insertReq.input("factory_type", sql.VarChar(50), data.factory_type);
    insertReq.input("nature_of_work", sql.VarChar(500), data.nature_of_work);
    insertReq.input("production_capacity", sql.Int, data.production_capacity);
    insertReq.input("working_hours", sql.Int, data.working_hours);
    insertReq.input("shifts", sql.Int, data.shifts);

    // STEP 2: Owner Details
    insertReq.input("owner_name", sql.VarChar(100), data.owner_name);
    insertReq.input("owner_email", sql.VarChar(100), data.owner_email);
    insertReq.input("owner_mobile", sql.VarChar(15), data.owner_mobile);
    insertReq.input("owner_aadhar", sql.Char(12), data.owner_aadhar);
    insertReq.input("owner_pan", sql.Char(10), data.owner_pan);
    insertReq.input("owner_gender", sql.VarChar(10), data.owner_gender);

    // // STEP 3: Operations
    insertReq.input("industry_type", sql.VarChar(50), data.industry_type);
    insertReq.input("hazardous_process", sql.Bit, data.hazardous_process);
    insertReq.input(
      "hazard_description",
      sql.VarChar(500),
      data.hazard_description,
    );
    insertReq.input("power_load", sql.Decimal(10, 2), data.power_load);
    insertReq.input("machinery_count", sql.Int, data.machinery_count);
    insertReq.input("boiler_installed", sql.Bit, data.boiler_installed);
    insertReq.input("boiler_type", sql.VarChar(100), data.boiler_type);

    // // STEP 4: Workers
    insertReq.input("male_workers", sql.Int, data.male_workers);
    insertReq.input("female_workers", sql.Int, data.female_workers);
    insertReq.input("contract_workers", sql.Int, data.contract_workers);
    insertReq.input("supervisors", sql.Int, data.supervisors);
    insertReq.input("safety_officer", sql.Bit, data.safety_officer);

    // Step 5 Documents

    insertReq.input("aadhar_doc", sql.VarChar(255), data.aadhar_doc);
    insertReq.input("pan_doc", sql.VarChar(255), data.pan_doc);


    const result = await insertReq.query(`
      INSERT INTO factorysync.dbo.factory_applications (
        user_id,
        factory_name,
        factory_address,
        factory_pincode,
        factory_email,
        factory_phone,
        factory_type,
        nature_of_work,
        production_capacity,
        working_hours,
        shifts,

        owner_name,
        owner_email,
        owner_mobile,
        owner_aadhar,
        owner_pan,
        owner_gender,

        industry_type,
        hazardous_process,
        hazard_description,
        power_load,
        machinery_count,
        boiler_installed,
        boiler_type,

        male_workers,
        female_workers,
        contract_workers,
        supervisors,
        safety_officer,

        aadhar_doc,
        pan_doc
      )
      OUTPUT INSERTED.application_id
      VALUES (
        @user_id,
        @factory_name,
        @factory_address,
        @factory_pincode,
        @factory_email,
        @factory_phone,
        @factory_type,
        @nature_of_work,
        @production_capacity,
        @working_hours,
        @shifts,

        @owner_name,
        @owner_email,
        @owner_mobile,
        @owner_aadhar,
        @owner_pan,
        @owner_gender,

        @industry_type,
        @hazardous_process,
        @hazard_description,
        @power_load,
        @machinery_count,
        @boiler_installed,
        @boiler_type,

        @male_workers,
        @female_workers,
        @contract_workers,
        @supervisors,
        @safety_officer,

        @aadhar_doc,
        @pan_doc
      )
    `);

    return result.recordset[0].application_id;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to insert factory info");
  }
}

// const result = await request.query(`
//   INSERT INTO factorysync.dbo.factory_applications (
//     user_id,
//     factory_name,
//     factory_address,
//     factory_pincode,
//     factory_email,
//     factory_phone,
//     factory_type,
//     nature_of_work,
//     production_capacity,
//     working_hours,
//     shifts,

//     owner_name,
//     owner_email,
//     owner_mobile,
//     owner_aadhar,
//     owner_pan,
//     owner_dob,
//     owner_gender,

//     industry_type,
//     hazardous_process,
//     hazard_description,
//     power_load,
//     machinery_count,
//     boiler_installed,
//     boiler_type,

//     male_workers,
//     female_workers,
//     contract_workers,
//     supervisors,
//     safety_officer
//   )
//   OUTPUT INSERTED.application_id
//   VALUES (
//     @user_id,
//     @factory_name,
//     @factory_address,
//     @factory_pincode,
//     @factory_email,
//     @factory_phone,
//     @factory_type,
//     @nature_of_work,
//     @production_capacity,
//     @working_hours,
//     @shifts,

//     @owner_name,
//     @owner_email,
//     @owner_mobile,
//     @owner_aadhar,
//     @owner_pan,
//     @owner_dob,
//     @owner_gender,

//     @industry_type,
//     @hazardous_process,
//     @hazard_description,
//     @power_load,
//     @machinery_count,
//     @boiler_installed,
//     @boiler_type,

//     @male_workers,
//     @female_workers,
//     @contract_workers,
//     @supervisors,
//     @safety_officer
//   )
// `);

// const result = await request.query(`
//   INSERT INTO factorysync.dbo.factory_applications (
//     user_id,
//     factory_name,
//     factory_address,
//     factory_pincode,
//     factory_email,
//     factory_phone,
//     factory_type,
//     nature_of_work,
//     production_capacity,
//     working_hours,
//     shifts,

//     industry_type,
//     hazardous_process,
//     hazard_description,
//     power_load,
//     machinery_count,
//     boiler_installed,
//     boiler_type,

//     male_workers,
//     female_workers,
//     contract_workers,
//     supervisors,
//     safety_officer

//   )
//   OUTPUT INSERTED.application_id
//   VALUES (
//     @user_id,
//     @factory_name,
//     @factory_address,
//     @factory_pincode,
//     @factory_email,
//     @factory_phone,
//     @factory_type,
//     @nature_of_work,
//     @production_capacity,
//     @working_hours,
//     @shifts,

//     @industry_type,
//     @hazardous_process,
//     @hazard_description,
//     @power_load,
//     @machinery_count,
//     @boiler_installed,
//     @boiler_type,

//     @male_workers,
//     @female_workers,
//     @contract_workers,
//     @supervisors,
//     @safety_officer

//   )
// `);
