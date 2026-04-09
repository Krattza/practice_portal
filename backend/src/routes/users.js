import express from 'express'
import { registerUser, verifyUser, login } from '../controllers/userController.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/verify-user', verifyUser)
router.post('/login', login)

export default router