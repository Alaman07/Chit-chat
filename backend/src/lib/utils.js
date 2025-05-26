import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
        expiresIn: '30d',
    })
    res.cookie('token', token, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true, //prevent XSS attacks cross-site scripting attacks
        sameSite: "strict", //prevennts CSRF attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV !== 'development',
    })
    return token;
};