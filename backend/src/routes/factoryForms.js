import express from 'express'
import { createFactoryRegistorForm, getCurrent, getPaymentDetails, generateApplicationPDF, generateAuthorizedPDF} from '../controllers/factoryFormController.js'
import { upload } from "../middlewares/upload.js";
import { authenticate } from '../middlewares/authentication.js';
import { authorize } from '../middlewares/authorize.js';


const router =  express.Router()

router.post('/register', authenticate, authorize('citizen'), upload.fields([
    { name: "aadhar_doc", maxCount: 1 },
    { name: "pan_doc", maxCount: 1 },
  ]), createFactoryRegistorForm)

router.get('/current',authenticate, authorize('citizen'), getCurrent)

router.get('/payment-detail', getPaymentDetails)

router.post('/get-pdf', generateApplicationPDF)

router.post('/final-pdf', generateAuthorizedPDF)

export default router