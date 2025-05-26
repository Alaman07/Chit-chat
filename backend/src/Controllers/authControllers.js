import cloudinary from '../lib/cloudinary.js';
import { generateToken } from '../lib/utils.js';
import User from '../Models/User.js';
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
    const { email, fullName, password } = req.body;
    
    if(!email || !fullName || !password) {
        return res.status(400).json({ message: "All fields are required"});
    }

    if(password.length < 6 ){
        return res.status(400).json({ message: "Password must be at least 6 characters long"});
    }

    const user = await User.findOne({ email });
    if(user) {
        return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        email,
        fullName,
        password: hashedPassword,
    })

    if(newUser){

        generateToken(newUser._id, res);
        await newUser.save();

        res.status(201).json({
            _id: newUser._id,
            email: newUser.email,
            fullName: newUser.fullName,
            profilePic: newUser.profilePic,
        });
    } else {
        res.status(400).json({ message: "Invalid user data" });
    }   
}


export const login = async (req, res) => {
    const { email, password } = req.body;
    try{
    if(!email || !password){
        return res.status(400).json({message: "please fill all the fields "});
    }
    const user = await User.findOne({email})

    if(!user){
        return res.status(400).json({ message: "invalid credentials" })
    }
    const isPassCorrect = await bcrypt.compare(password,user.password)
    if(!isPassCorrect){
        return res.status(400).json({ message: "invalid credentials "});
    }
    generateToken(user._id,res);
    
    res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
    })

    } catch (error) {
        console.log("error in login controller",error.message)
        res.status(500).json({message: "Internal server error"})
    }    

}

export const logout = (req, res) => {
    try{
        res.cookie("token","",{maxAge:0})
        res.status(200).json({message: "logged out successfully" })
    } catch (error){
        console.log("error in logout controller: ", error.message)
    }
}

export const updateProfile = async (req, res) => {
    try{
    const { profilePic } = req.body;
    const userId = req.user._id;
    
    if(!profilePic) {   
        return res.status(400).json({message: "profile picture is required"})
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic)
    const updatedUser = await User.findByIdAndUpdate(userId, {profilePic:uploadResponse.secure_url},{new:true});
    res.status(200).json(updatedUser);

    } catch(error) {
        console.log("error in updateProfile middleware : ", error.message)
        return res.status(500).json({message: "Internal Server error"})
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("error in checkAuth controller: ",error.message);
        res.status(500).json({message: "Internal Server error"});
    }
};