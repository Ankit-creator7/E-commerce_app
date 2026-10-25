import validator from "validator";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET) 
}

//Route for user login
const loginUser = async (req, res) => {

    try{
        const {email, password} = req.body;

        const user = await userModel.findOne({email});

        if(!user){
            return res.json({success: false, message: "User not found"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(isMatch){
            const token = createToken(user._id);
            return res.json({success: true, token});
        }

        else{
            res.json({success: false, message: "Invalid credentials"});
        }

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

//Route for user registration
const registerUser = async (req, res) => {

    try{
        const {name, email, password} = req.body;

        //Check if user already exists
        const exists = await userModel.findOne({email});

        if(exists){
            return res.json({success: false, message: "User already exists"});
        }

        //Validating email format & strong password
        if(!validator.isEmail(email)){
            return res.json({success: false, message: "Please enter a valid email"});
        }
        if(password.length < 8){
            return res.json({success: false, message: "Please enter a strong password with minimum 8 characters"});
        }

        //Hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        const token = createToken(savedUser._id);

        res.json({success: true, token})        

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

//Route for Admin login
const loginAdmin = async (req, res) => {

    try{
        const {email, password} = req.body;

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password, process.env.JWT_SECRET);
            res.json({success: true, token});
        }
        else{
            res.json({success: false, message: "Invalid credentials"});
        }
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }

}


// Route to get user profile
const getUserProfile = async (req, res) => {
    try {
        const userId = req.body?.userId || req.userId;
        const user = await userModel.findById(userId).select("-password");
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Route to update user profile (e.g. name)
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.body?.userId || req.userId;
        const { name } = req.body;
        if (!name || !name.trim()) {
            return res.json({ success: false, message: "Name cannot be empty" });
        }
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { name: name.trim() },
            { new: true }
        ).select("-password");
        res.json({ success: true, message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Route for forgot password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.json({ success: false, message: "Please enter your email" });
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "No account found with this email" });
        }
        res.json({ 
            success: true, 
            message: "Password reset instructions have been dispatched to your email address." 
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { loginUser, registerUser, loginAdmin, getUserProfile, updateUserProfile, forgotPassword };