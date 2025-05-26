import jwt from 'jsonwebtoken';
import User from '../Models/User.js'

export const protectRoute = async (req, res, next) => {

    try{
        const token = req.cookies.token
        if(!token){
            return res.status(401).json({message: "Not Authorized - No token"})
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        
        if(!decoded){
            return res.status(401).json({message: "Not Authorized - No token"})
        }
        const user = await User.findById(decoded.userId).select("-password")

        if(!user){
            return res.status(404).json({message: "User does not exist"})
        }
        req.user = user

        next()

    } catch(error) {
        console.log("error in protect Route middleware: ", error.message)
        return res.status(500).json({ message: "Internal Server error"})
    }

};