import express from 'express'
import { registerUser, verifyUser, loginUser, getCurrentUser } from '../controllers/userController.js'
import { refreshAccessToken } from '../utils/refreshAccessToken.js'
import { authenticate } from '../middlewares/authentication.js'
import { authorize } from '../middlewares/authorize.js'


const router = express.Router()

router.post('/register', registerUser)
router.post('/verify-user', verifyUser)
router.post('/login', loginUser)
router.post('/refresh', refreshAccessToken)
router.get('/me',  getCurrentUser)

export default router