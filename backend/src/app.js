// Defines my app like middlewares and routing

import express from 'express'
import users from './routes/users.js'
import factoryForms from './routes/factoryForms.js'
import cookieParser from "cookie-parser";
import cors from 'cors'
import eSign from './routes/eSign.js'


const app = express()

// Add middleware
app.use(cors(
{
    origin: 'http://localhost:5173',
    credentials: true
}
))

app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        project: 'FactorySyc'
    })
})

app.use('/api/esign', eSign)
app.use('/api/users', users)
app.use('/api/forms', factoryForms)


app.use((req, res)=> {
    res.status(404).json({success: false, message: 'Route not found'})
})

export default app

// SSO || for now OTP || ONe authenctication

// User dashboard

// Admin dashboard