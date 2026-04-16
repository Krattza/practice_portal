import express from 'express'
import { sendESignOTP, verifyESignOTP } from '../controllers/esignController.js'

const router = express.Router()

router.post('/send-otp', sendESignOTP)
router.post('/verify-otp', verifyESignOTP)


export default router