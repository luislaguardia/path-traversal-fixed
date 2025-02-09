import User from '../models/user.js';
import { hashPassword, comparePassword } from '../helpers/auth.js';
import jwt from 'jsonwebtoken';


export const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        if(!name) {
            return res.json({
                error: 'name is required'
            })
        };
        if(!password || password.length < 6) {
            return res.json({
                error: 'Password is required and should be at least 6 chars long'
            })
        };
        const exist = await User.findOne({email})
        if(exist) {
            return res.json({
                error: 'Email is already taken'
            })
        };

        const hashedPassword = await hashPassword(password)

        const user = await User.create({
            name, 
            email, 
            password: hashedPassword,
        });

        return res.json(user)
    } catch (error) {
        console.log(error)
        
    }

}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({ error: "No user found." });
        }

        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(400).json({ error: "Incorrect password." });
        }

        // Generate JWT token
        const token = jwt.sign(
            { email: user.email, _id: user._id, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        const sanitizedUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
        };

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiry
        });

        res.status(200).json({
            user: sanitizedUser,
            message: "Login successful",
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};



//profile 
// TO BE REMOVED IF NO USE : but probably ... in another universe we can still use it ;
export const getProfile = (req, res) => {
const {token} = req.cookies
if(token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
        if(err) throw err;
        res.json(user)
    })
} else {
    res.json(null)
}
}
