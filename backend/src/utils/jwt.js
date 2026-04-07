import jwt from 'jsonwebtoken'

export const generateAccessToken = (user) => {
    return jwt.sign(
        {id: user.id, role: user.role },
        process.env.JWT_ACCESS_SECRET,
        {expiresIn: process.env.JWT_ACCESS_EXPIRES_IN}
    )
}

export const generateRefreshToken = (user) => {
    return jwt.sign(
        {id: user.id},
        process.env.JWT_REFRESH_SECRET,
        {expiresIn: process.env.JWT_REFRESH_EXPIRES_IN}
    )
}

export const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET)
}

export const verfiyRefreshToken = (token) => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET)
}

