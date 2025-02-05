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

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ error: 'No user found' });
        }

        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.json({ error: "Passwords do not match" });
        }

        const token = jwt.sign({ email: user.email, _id: user._id, name: user.name }, process.env.JWT_SECRET, {
            // expiresIn: "7d" // Ensure the token has an expiration time
            // MUST BE REVIEWED!!!!!!!!!!!!!!!!!!!!!!!!!
        });

        res.json({ user, token }); // Send token in response body
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
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
