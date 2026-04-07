// Defines my app like middlewares and routing

import express from 'express'
import users from './routes/users.js'

const app = express()


// Add middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        project: 'FactorySyc'
    })
})

app.use('/api/users', users)

app.use((req, res)=> {
    res.status(404).json({success: false, message: 'Route not found'})
})

export default app

// SSO || for now OTP || ONe authenctication

// User dashboard

// Admin dashboard