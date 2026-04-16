import { registrationSchema } from "../validators/factorFormValidators.js";
import { factoryRegisterService } from "../services/factoryFormService.js";
import { getPool } from "../config/db2.js";
import { timingSafeEqual } from "crypto";
import sql from 'mssql'

import fs from 'fs'
import path from 'path'
import PDFDocument from "pdfkit";

export async function createFactoryRegistorForm(req, res) {
  try {

    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const aadharFile = req.files?.aadhar_doc?.[0];
    const panFile = req.files?.pan_doc?.[0];

    const aadharPath = aadharFile ? `/uploads/${aadharFile.filename}` : null;
    const panPath = panFile ? `/uploads/${panFile.filename}` : null;

   const bodyData = {
      ...req.body,
      aadhar_doc: aadharPath,
      pan_doc: panPath,
    };
    const parsed = registrationSchema.safeParse(bodyData);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        errors: parsed.error.issues.map((i) => i.message),
      });
    }

    const data = parsed.data;

    // harcoded for now
    data.user_id = '99bf8ad4-498d-4d16-a025-a69bf80f41a2';

    const applicationId = await factoryRegisterService(data);

    return res.status(201).json({
      success: true,
      message: "Form submitted successfully",
      application_id: applicationId,
      files: {
        aadhar: aadharPath,
        pan: panPath,
      },
    });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
}

export async function getPreview(req, res) {
  const token = req.cookies.session_token 
  console.log(token)
  res.send('Ok')
}

export async function getCurrent(req, res) {
  const userId = "99bf8ad4-498d-4d16-a025-a69bf80f41a2"
  // Build validation i dont think i need one

  // so service 

  async function getCurrentService() {

    const pool = getPool()

   
    // call database
    // and search for that specifc user
    const request = pool.request()
    request.input('userId', sql.VarChar(36), userId)
    // console.log(request)
    const result = await request.query( ` 
        SELECT * FROM factorysync.dbo.factory_applications WHERE user_id=@userId
      `)
       
      
    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No application found"
      });
    }

    const data = result.recordset[0];

    return res.status(200).json({
      success: true,
      data: data
    })
  }

  getCurrentService()
}

export async function getPaymentDetails(req, res) {
    res.status(200).json({
  "application_id": 1,
  "amount": 1500,
  "fee_breakdown": {
    "registration_fee": 1000,
    "inspection_fee": 500
  }
})
}

export const generateApplicationPDF = async (req, res) => {
  try {
    const data = req.body; 

    const doc = new PDFDocument();

    const filePath = `uploads/application-${Date.now()}.pdf`;
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

     // HEADER
    doc.fontSize(18).text("Factory Registration Application", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Application ID: ${data.application_id}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.text(`Status: Pending at Citizen`);
    doc.moveDown();

    // SECTION 1
    doc.fontSize(14).text("Factory Information");
    doc.fontSize(12);
    doc.text(`Name: ${data.factory_name}`);
    doc.text(`Address: ${data.factory_address}`);
    doc.text(`Pincode: ${data.factory_pincode}`);
    doc.text(`Email: ${data.factory_email}`);
    doc.text(`Phone: ${data.factory_phone}`);
    doc.text(`Type: ${data.factory_type}`);
    doc.text(`Nature: ${data.nature_of_work}`);
    doc.text(`Production Capacity: ${data.production_capacity}`);
    doc.text(`Working Hours: ${data.working_hours}`);
    doc.text(`Shifts: ${data.shifts}`);
    doc.moveDown();

    // SECTION 2
    doc.fontSize(14).text("Owner Details");
    doc.fontSize(12);
    doc.text(`Name: ${data.owner_name}`);
    doc.text(`Email: ${data.owner_email}`);
    doc.text(`Mobile: ${data.owner_mobile}`);
    doc.text(`Aadhar: ${data.owner_aadhar}`);
    doc.text(`PAN: ${data.owner_pan}`);
    doc.text(`Gender: ${data.owner_gender}`);
    doc.moveDown();

    // SECTION 3
    doc.fontSize(14).text("Operations");
    doc.fontSize(12);
    doc.text(`Industry: ${data.industry_type}`);
    doc.text(`Hazardous: ${data.hazardous_process ? "Yes" : "No"}`);
    doc.text(`Hazard Desc: ${data.hazard_description}`);
    doc.text(`Power Load: ${data.power_load}`);
    doc.text(`Machines: ${data.machinery_count}`);
    doc.text(`Boiler: ${data.boiler_installed ? "Yes" : "No"}`);
    doc.text(`Boiler Type: ${data.boiler_type}`);
    doc.moveDown();

    // SECTION 4
    doc.fontSize(14).text("Workers");
    doc.fontSize(12);
    doc.text(`Male: ${data.male_workers}`);
    doc.text(`Female: ${data.female_workers}`);
    doc.text(`Contract: ${data.contract_workers}`);
    doc.text(`Supervisors: ${data.supervisors}`);
    doc.text(`Safety Officer: ${data.safety_officer ? "Yes" : "No"}`);
    doc.moveDown();

    doc.end();


    stream.on("finish", () => {
      res.json({
        success: true,
        pdf_url: `/${filePath}`,
      });
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "PDF generation failed" });
  }
};

export async function generateAuthorizedPDF(req, res) {
   try {
    const data = req.body; 

    const doc = new PDFDocument();

    const filePath = `uploads/application-${Date.now()}.pdf`;
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

     // HEADER
    doc.fontSize(18).text("Factory Registration Application", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Application ID: ${data.application_id}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.text(`Status: Pending at Citizen`);
    doc.moveDown();

    // SECTION 1
    doc.fontSize(14).text("Factory Information");
    doc.fontSize(12);
    doc.text(`Name: ${data.factory_name}`);
    doc.text(`Address: ${data.factory_address}`);
    doc.text(`Pincode: ${data.factory_pincode}`);
    doc.text(`Email: ${data.factory_email}`);
    doc.text(`Phone: ${data.factory_phone}`);
    doc.text(`Type: ${data.factory_type}`);
    doc.text(`Nature: ${data.nature_of_work}`);
    doc.text(`Production Capacity: ${data.production_capacity}`);
    doc.text(`Working Hours: ${data.working_hours}`);
    doc.text(`Shifts: ${data.shifts}`);
    doc.moveDown();

    // SECTION 2
    doc.fontSize(14).text("Owner Details");
    doc.fontSize(12);
    doc.text(`Name: ${data.owner_name}`);
    doc.text(`Email: ${data.owner_email}`);
    doc.text(`Mobile: ${data.owner_mobile}`);
    doc.text(`Aadhar: ${data.owner_aadhar}`);
    doc.text(`PAN: ${data.owner_pan}`);
    doc.text(`Gender: ${data.owner_gender}`);
    doc.moveDown();

    // SECTION 3
    doc.fontSize(14).text("Operations");
    doc.fontSize(12);
    doc.text(`Industry: ${data.industry_type}`);
    doc.text(`Hazardous: ${data.hazardous_process ? "Yes" : "No"}`);
    doc.text(`Hazard Desc: ${data.hazard_description}`);
    doc.text(`Power Load: ${data.power_load}`);
    doc.text(`Machines: ${data.machinery_count}`);
    doc.text(`Boiler: ${data.boiler_installed ? "Yes" : "No"}`);
    doc.text(`Boiler Type: ${data.boiler_type}`);
    doc.moveDown();

    // SECTION 4
    doc.fontSize(14).text("Workers");
    doc.fontSize(12);
    doc.text(`Male: ${data.male_workers}`);
    doc.text(`Female: ${data.female_workers}`);
    doc.text(`Contract: ${data.contract_workers}`);
    doc.text(`Supervisors: ${data.supervisors}`);
    doc.text(`Safety Officer: ${data.safety_officer ? "Yes" : "No"}`);
    doc.moveDown();

    doc.end();


    stream.on("finish", () => {
      res.json({
        success: true,
        pdf_url: `/${filePath}`,
      });
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "PDF generation failed" });
  }
};


//  application_id: 1,
//     user_id: '99bf8ad4-498d-4d16-a025-a69bf80f41a2',
//     factory_name: 'maker factory',
//     factory_address: 'E-148 Nirman Nagar, Ajmer Road',
//     factory_pincode: '302019',
//     factory_email: 'aadars@gmail.com',
//     factory_phone: '6264425768',
//     factory_type: '',
//     nature_of_work: 'Hazzardoious maintain all prcautions',
//     production_capacity: 12,
//     working_hours: 12,
//     shifts: 2,
//     owner_name: 'Manoj Kumar',
//     owner_email: 'manoj@gmail.com',
//     owner_mobile: '8876524554',
//     owner_aadhar: '123412341234',
//     owner_pan: 'ABCPR1234F',
//     owner_dob: null,
//     owner_gender: 'Male',
//     industry_type: 'Petrolium Cynaide',
//     hazardous_process: true,
//     hazard_description: 'Quite hazarodious maintain precautiosn',
//     power_load: 12,
//     machinery_count: 12,
//     boiler_installed: true,
//     boiler_type: 'Coprote Boiler',
//     male_workers: 12,
//     female_workers: 12,
//     contract_workers: 3,
//     supervisors: 3,
//     safety_officer: true,
//     aadhar_doc: '/uploads/1776217352707-559286692.pdf',
//     pan_doc: '/uploads/1776217352717-964579513.jpeg',
//     building_plan_doc: null,
//     gst_certificate_doc: null,
//     fire_safety_doc: null,
//     declaration_accepted: null,
//     digital_signature: null,
//     status: 'Draft',
//     step_completed: 1,
//     created_at: '2026-04-15 07:12:33.0010781',
//     updated_at: '2026-04-15 07:12:33.0010781',
//     submitted_at: null