const Users = require("../Models/Users")
const {loginSchema, registerSchema} = require("./Validation/userValidation")
const jwt = require('jsonwebtoken');

const login = async (req , res) =>{
     try {

        const {error, value} = loginSchema.validate(req.body, {abortEarly: false, stripUnknown: true})

        if(error) return res.status(400).json({msg: error.details.map(err => err.message)})

        const {email, password} = value;

        const user = await Users.findOne({email})

        if(!user) return res.status(400).json({msg: "Invalid Email or Password"})

        const matchedPassword = await user.comparePassword(password);

        if(!matchedPassword) return res.status(400).json({msg: "Invalid Email or Password"})

        await Users.findOneAndUpdate({email},{is_active: "Active"})

        const token = jwt.sign({id:user._id, role: user.role}, process.env.Secret_Key, {expiresIn: "1d", algorithm: "HS256"})

        res.status(200).json({msg: "Success Login", token, user})

    } catch (error) {
        res.status(500).json({msg: "Server Error", error: error.message});
    }
}

const register = async (req, res) => {
    try {

        const {error, value} = registerSchema.validate(req.body, {abortEarly: false, stripUnknown: true})

        const {email, password, first_name, last_name, role, image} = value

        if(error) return res.status(400).json({msg: error.details.map(err => err.message)})

        const existuser = await Users.findOne({email})

        if(existuser) return res.status(400).json({msg: "User Already Exist"})

        const user = await Users.create({email, password, first_name, last_name, role, image: req.file.path})

        if (!req.file) return res.status(400).json({msg: "Image is required"});

        res.status(201).json({msg: "User Created Successfully", data: user})

    } catch (error) {
        res.status(500).json({msg: "Server Error", error: error.message});
    }
}

const logout = async (req, res) => {
    try {
        const {token} = req.body;
        
        const decoded = jwt.verify(token, process.env.Secret_Key);

        if (!token) return res.status(400).json({msg: "Token is required"});
        
        const user = await Users.findById(decoded.id);

        if (!user) return res.status(204).json({msg: "User Already Logged out"});

        await Users.findByIdAndUpdate(decoded.id ,{is_active: "Inactive", last_login: new Date()}) 

        res.json({msg: "Logged out Successfully"});

    } catch (error) {
        res.status(500).json({msg: "Server Error", error: error.message});
    }
}

module.exports = {login, register, logout};
