import genToken from "../config/token.js";
import User from "../models/user.mode.js";
import bcrypt from 'bcryptjs';

export const signUp = async (req, res) => {
    try {
        let { firstName, lastName, userName, email, password } = req.body;
        
        let existEmail = await User.findOne({ email });
        if (existEmail) return res.status(400).json({ message: "email already exist" });

        let existUsername = await User.findOne({ userName });
        if (existUsername) return res.status(400).json({ message: "username already exist " });

        if (password.length < 8) return res.status(400).json({ message: "password must be 8 letter" });

        let hassedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            userName,
            email,
            password: hassedPassword,
        });

        // FIX 1: Added await because genToken is async
        let token = await genToken(user._id); 
        
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "lax", // Better for local testing than "strict"
            secure: false    // Must be false for localhost
        });

        res.status(201).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        let user = await User.findOne({ email });
        
        if (!user) return res.status(400).json({ message: "user doesnot exist" });

        // FIX 2: Added await for bcrypt.compare
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(400).json({ message: "incorrect password" });
       
        // FIX 3: Added await for genToken
        let token = await genToken(user._id); 
        
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "lax",
            secure: false
        });

        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Login error" });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "logout successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "logout error" });
    }
};